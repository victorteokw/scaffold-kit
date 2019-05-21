interface UpdateJSONFileInfo {
    updator: (original: any) => any;
    rollbacker: (original: any) => any;
    at: string;
}

export default UpdateJSONFileInfo;
