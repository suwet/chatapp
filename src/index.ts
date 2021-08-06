
import { Observable, Subscriber } from 'rxjs';
import { ajax, AjaxRequest, AjaxResponse } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { ofType, unionize } from 'unionize';


export const AjaxUpdate = unionize(
    {
        ProgressEvent: ofType<ProgressEvent>(),
        Response: ofType<AjaxResponse<any>>(),
    },
    'tag',
    'value',
);
export type AjaxUpdate = typeof AjaxUpdate._Union;

export const ajaxWithUpdates = (request: AjaxRequest): Observable<AjaxUpdate> =>
    new Observable<AjaxUpdate>(sub => {
        const progressSubscriber = Subscriber.create<ProgressEvent>(
            (progress_event:ProgressEvent) => sub.next(AjaxUpdate.ProgressEvent(progress_event)),
            (e:any) => sub.error(e),
            ()=> {}
        );
        const ajax$ = ajax({
            ...request,
            progressSubscriber,
        });
        const subscription = ajax$
            .pipe(map(ajaxResponse => AjaxUpdate.Response(ajaxResponse)))
            .subscribe(sub);
        return () => subscription.unsubscribe();
    });