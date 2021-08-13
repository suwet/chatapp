
import { Observable, Subscriber,fromEvent,from, interval, scheduled, Scheduler, observable, of } from 'rxjs';
import { ajax, AjaxRequest, AjaxResponse } from 'rxjs/ajax';
import { map,debounceTime ,filter,distinctUntilChanged,takeUntil, switchMap, flatMap,tap,sequenceEqual} from 'rxjs/operators';
import {message_result,group_message_result} from './models/message_result'
import * as $ from "jquery";
import { request_message } from './models/request_message';
//avoid conflit with version
const {render} = require('../node_modules/mustache/mustache.js')


const service_url:string = "https://localhost:5001";


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
let text = '';

let onNext = (t:string) => { text = t; }
let onError = (e:Error) => {console.log(e)}


let onComplete = () => {            
  //console.log(text);
  let msg_object = {
    "msg_id": 1,
    "msg_content": text,
    "msg_type": 1,
    "send_date": null as string,
    "is_active": true,
    "is_delete": false,
    "is_reply_back": true,
    "is_cancel": false,
    "msg_uuid": null as string,
    "user_id": 1,
    "group_id": 1
  };
  $.ajax({
    type: "POST",
    url: "https://localhost:5001/api/Chat/SaveMessage",
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify(msg_object),
    contentType: "application/json; charset=utf-8",
    success: function(data){console.log('success',data);},
    error: function(errMsg) {
        console.log('error',errMsg);
    }
});

  $('#txt_message').val('');
  $('#txt_message').focus();
  line_messages.subscribe(onNext, onError, onComplete);
};

line_messages.subscribe(onNext, onError, onComplete);

const ajax_every_second = interval(2000).pipe(map(x=> x),switchMap(s =>{
    let send_data:request_message = {user_id:3,group_id:1};
    let request_obj = {
        url: 'https://localhost:5001/api/Chat/ListMessageByGroupId',
        method: 'POST',
        body: send_data,
        headers: {
            'contentType':'application/json; charset=utf-8',
            'dataType':'json'
        },
    };

    return ajax<group_message_result>({
        ...request_obj
    });
})).pipe(map(res=>res),filter(v=> v.status == 200),filter(d=>{
    //let res_array = d.response.messages.map(x=>x.msg_uuid);
    let msg_list:Array<string> = $('div[class*=justify-content]').map(function() {
        return $(this).data("msg_data");
    }).get();
    if(JSON.stringify(d.response.messages.map(x=>x.msg_uuid))===JSON.stringify(msg_list)){
        return false;
    }
    return true;
}));


ajax_every_second.subscribe((res)=>
{
    //console.log(res.response);
    let template = $('#list-msgs').html();
    let rendered = render(template,res.response);
    //console.log(template);
    $('#msg_card_list').html(rendered);

},(err)=>
{
    console.log(err);
});



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