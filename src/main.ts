import { from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import SynchronizationConfig from './model/synchronizationConfig'
import { subMinutes } from 'date-fns'

const items$ = from(SynchronizationConfig.findAll({ last_sync_time: { $lte: subMinutes(new Date(), 15) } }))

// items$.pipe(
//   mergeMap(() => {
//     // code to perform parallel tasks on each item
//   })
// ).subscribe(
//   result => {
//     console.log(`Result: ${result}`);
//   },
//   error => {
//     console.error(error);
//   },
//   () => {
//     console.log('Completed');
//   })
