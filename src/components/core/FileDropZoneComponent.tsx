import React, {useRef, useState} from 'react';
import {CloudUploadOutlined} from "@material-ui/icons";
import {Button} from "@material-ui/core";
import { useTranslation } from 'react-i18next';

export interface FileDropZoneComponentProps {
    OnFileSelected: (files: File[]) => void,
    text?:string
}

const FileDropZoneComponent = (props: FileDropZoneComponentProps) => {
    const {t}=useTranslation()
    const {OnFileSelected} = props;
    const defaultText=props.text ||  "Drag File Here"
    const inputFile = useRef<HTMLInputElement | null>();
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileSelect = (evt: any) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'none';
        setIsDragOver(false);
        const files = evt.dataTransfer.files; // FileList object.
        filesSelected(files);
    }

    const handleFileInputSelect = (e: any) => {
        const files = e.target.files; // FileList object.
        filesSelected(files);
        e.target.value = null;
    }

    const filesSelected = (files: any[]) => {
        files = Array.from(files);
        OnFileSelected(files);
    }

    const handleDragLeave = (e: any) => {
        setIsDragOver(false);
        e.dataTransfer.dropEffect = 'none';
    }

    const handleDragOver = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        setIsDragOver(true);
        e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    return (
        <>
            <div className={"ts-file-drop-zone" + (isDragOver ? ' drag-enter-effect' : '')}
                 onDrop={handleFileSelect}
                 onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
                <div className="file-upload-icon"><CloudUploadOutlined style={{fontSize: 120}}/></div>
                {t(defaultText)}
                <div className="clearfix mrg-bottom-10"/>
                <div className="legend-line">or</div>
                <div className="clearfix mrg-bottom-10"/>

                <input id={'upload-btn'} ref={instance => inputFile.current = instance} type="file"
                       onChange={handleFileInputSelect} multiple className="display-none"/>
                <Button onClick={event => {
                    if (inputFile.current) inputFile.current.click();
                }} color="secondary" className="browse-button" id="btn_browse_file">{t('Browse')}</Button>
            </div>
        </>
    )
};

export default FileDropZoneComponent;
