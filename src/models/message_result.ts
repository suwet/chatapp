
export interface group_message_result
{
    messages:Array<message_result>;
}


export interface message_result
{
    email:string,
    group_avatar: string,
    group_id: number,
    group_name: string,
    group_type: number,
    is_active: boolean,
    is_anonymous: boolean,
    is_cancel: boolean,
    is_delete: boolean,
    is_reply_back: boolean,
    msg_content:string,
    msg_id: number,
    msg_type: number,
    msg_uuid: string,
    name: string,
    send_date: string,
    user_avatar: string,
    user_id:number,
    is_owner:boolean
}