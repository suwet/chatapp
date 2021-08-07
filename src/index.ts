
import { Observable, Subscriber,fromEvent, observable } from 'rxjs';
import { ajax, AjaxRequest, AjaxResponse } from 'rxjs/ajax';
import { map,debounceTime ,filter,distinctUntilChanged,takeUntil} from 'rxjs/operators';
import * as $ from "jquery";




const enter_message = 
                    fromEvent<KeyboardEvent>($('#txt_message'),'keyup')
                    .pipe(
                    debounceTime(150),
                    filter((e: KeyboardEvent) => e.keyCode === 13),
                    distinctUntilChanged());
const message = 
                    fromEvent<any>($('#txt_message'),'keyup')
                    .pipe(
                    map(input=>input.target.value),
                    debounceTime(150),
                    distinctUntilChanged());


const line_messages = message.pipe(takeUntil(enter_message));

var text = '';
var onNext = (t:string) => { text = t; }
var onError = (e:Error) => {console.log(e)}
var onComplete = () => {            
  console.log(text);
  $('#txt_message').val('');
  $('#txt_message').focus();
  line_messages.subscribe(onNext, onError, onComplete);
};
line_messages.subscribe(onNext, onError, onComplete);

/*

export const AjaxUpdate = unionize(
    {
        ProgressEvent: ofType<ProgressEvent>(),
        Response: ofType<AjaxResponse>(),
    },
    'tag',
    'value',
);
export type AjaxUpdate = typeof AjaxUpdate._Union;

export const ajaxWithUpdates = (request: AjaxRequest): Observable<AjaxUpdate> =>
    new Observable<AjaxUpdate>(subscriber => {
        const progressSubscriber = new Subscriber<ProgressEvent>(
            progressEvent => subscriber.next(AjaxUpdate.ProgressEvent(progressEvent)),
            error => subscriber.error(error),
            // Forward next and error but not complete
            // When progress is complete, we send the response *then* complete.
            () => {},
        );
        const ajax$ = ajax({
            ...request,
            progressSubscriber,
        });
        const subscription = ajax$
            .pipe(map(ajaxResponse => AjaxUpdate.Response(ajaxResponse)))
            .subscribe(subscriber);
        return () => subscription.unsubscribe();
    });

//
// Example
//

const outputTextEl = document.querySelector('.outputText')!;
const filePickerEl = document.querySelector('.filePicker') as HTMLInputElement;

const upload = (file: File) =>
    ajaxWithUpdates({
        url: 'https://httpbin.org/post',
        method: 'POST',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    });

filePickerEl.addEventListener('change', event => {
    const { files } = event.target as HTMLInputElement;
    const maybeFirstFile = files[0] as File | undefined;

    upload(maybeFirstFile).subscribe(
        AjaxUpdate.match({
            ProgressEvent: progressEvent => {
                const text = `Progress: ${(progressEvent.loaded / progressEvent.total) * 100}%`;
                outputTextEl.textContent = text;
            },
            Response: _ajaxResponse => {
                const text = 'Upload complete';
                outputTextEl.textContent = text;
            },
        }),
    );
});

    */