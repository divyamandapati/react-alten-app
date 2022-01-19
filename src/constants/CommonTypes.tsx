export interface TsConfirmationItem {
    color?: 'default' | 'primary' | 'secondary' | 'inherit';
    text?: string;
}

export interface TsConfirmationConfig {
    no?: TsConfirmationItem;
    yes?: TsConfirmationItem;
    confirmationText?: string;
}

export interface DialogMethodProps {
    confirm?: () => void;
    cancel?: () => void;
    removeModal: () => void;
}


export interface NotificationCardProps {
    added_by: string;
    appointment_id: string,
    hospital_id?: string
    user_id: string,
    date?: string;
    _created?: string;
    _updated?: string,
    type: string;
    _id: string;
    is_read: boolean;
    patient_id:string;
}
