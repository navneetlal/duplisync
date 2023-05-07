import { subMinutes } from 'date-fns'
import { ObjectId } from 'mongodb'
import { combineLatest, forkJoin, from, of } from 'rxjs'
import { filter, groupBy, map, mergeMap, reduce, tap, toArray } from 'rxjs/operators'

import SynchronizationConfig, { SynchronizationConfigDocument } from './model/synchronizationConfig'
import database from './infra/database'
;(async function main() {
  await database.connect()
  const items$ = from(SynchronizationConfig.findAll({})) // last_sync_time: { $lte: subMinutes(new Date(), 15) }

  items$
    .pipe(
      mergeMap((items) => from(items)),
      groupBy((item) => item.source_collection),
      mergeMap((group) =>
        group.pipe(
          toArray(),
          map((arr) =>
            arr.sort((a, b) => new Date(a.last_sync_time).getTime() - new Date(b.last_sync_time).getTime())
          ),
          map((arr) => ({ key: group.key, values: arr }))
        )
      ),
      mergeMap((item) => {
        const sourceColl = database.getDb().collection(item.key)
        const sourceDocuments = sourceColl
          .find({
            [item.values[0]?.source_last_updated_key ?? 'updated_at']: {
              $gte: item.values[0]?.last_sync_time
                ? new Date(item.values[0]?.last_sync_time)
                : subMinutes(new Date(), 15),
            },
          })
          .toArray()
        return forkJoin([of(item), from(sourceDocuments)])
      }),
      filter(([_, sourceDocuments]) => !!sourceDocuments.length),
      mergeMap(([item, sourceDocuments]) => {
        return combineLatest({
          sourceDocuments: of(sourceDocuments),
          values: from(item.values),
        })
      }),
      mergeMap((item) => {
        const destColl = database.getDb().collection(item.values.destination_collection)
        const bulkWriteOps = item.sourceDocuments.map((source) => {
          return {
            updateMany: {
              filter: { [item.values.destination_key]: source[item.values.source_key] },
              update: { $set: { [item.values.destination_field]: source } },
            },
          }
        })
        return forkJoin([of(item), from(destColl.bulkWrite(bulkWriteOps))])
      }),
      tap(([item, bulkWriteResult]) => {
        console.log('item: ', item.values)
        console.log('sourceDocuments: ', item.sourceDocuments)
        console.log('bulkWriteResult: ', bulkWriteResult)
      }),
      reduce((acc, [item, _]) => {
        acc.push(item.values)
        return acc
      }, [] as SynchronizationConfigDocument[]),
      mergeMap((item: SynchronizationConfigDocument[]) => {
        return SynchronizationConfig.updateAll(
          { _id: { $in: item.map((config) => new ObjectId(config._id)) } },
          { $set: { last_sync_time: new Date() } }
        )
      })
    )
    .subscribe({
      error(err) {
        console.log(err)
      },
      complete() {
        console.log('done')
        database.close()
      },
    })
})()
