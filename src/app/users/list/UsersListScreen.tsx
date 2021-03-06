import React, { useEffect,useCallback,useState } from 'react';
import './UserListScreen.scss';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { no_data } from "../../../constants/ImageConfig"
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Pagination from '@material-ui/lab/Pagination';
import TableRow from '@material-ui/core/TableRow';
import { TsDataListOptions, TsDataListWrapperClass } from "../../../classes/ts-data-list-wrapper.class";
import { ENV } from "../../../constants";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ApiService, Communications} from "../../../helpers";
import { Button,  LinearProgress, TextField } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search'
import DialogComponent from "../../../components/core/DialogComponent";
import UserAddComponent from "../add/UserAddComponent";
import ClearIcon from '@material-ui/icons/Clear';
import UserEditComponent from "../edit/UserEditComponent";
import CommonService from "../../../helpers/common-service";

export default function UsersListScreen(props: any) {
    const [list, setList] = useState<{ table: TsDataListWrapperClass } | null>(null);
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [candidateDetails,setCandidateDetails] = useState<any>(null);
    const [page,setPage]=React.useState<any>(1);
    const onReload = useCallback((page = 1) => {
        if (list) {
            list.table.reload(page);
        } else {
            setList(prevState => {
                prevState?.table.reload(page);
                return prevState;
            })
        }
    }, [list]);

    const init = useCallback(() => {
        // config
        if(!list){
        const options = new TsDataListOptions({
            webMatColumns: ['User Id', 'Name', 'Email', 'Phone','Position','actions'],
            mobileMatColumns: ['User Id', 'Name', 'Email', 'Phone','Position', 'actions'],
        }, ENV.API_URL + '/candidate', setList, ApiService,'get');

        let tableWrapperObj = new TsDataListWrapperClass(options)
        setList({ table: tableWrapperObj });
    }
    },[list])

    useEffect(() => {
        init();
        Communications.pageTitleSubject.next('Candidate List');
        Communications.pageBackButtonSubject.next(null);
        Communications.accessRoleSubject.next('');
        Communications.accessRoleLinkSubject.next('');
    }, [init])

   const handleClearSearch=useCallback(()=>{
    if (list?.table) {
        list.table.filter.search = ""
        list.table.reload();
    }
   },[list])
   
    const openAdd =useCallback (() => {
        setIsAddOpen(true);
    },[])

    const cancelAdd = useCallback(() => {
        setIsAddOpen(false);
        onReload(1)
    },[onReload])

    const confirmAdd = useCallback(() => {
        setIsAddOpen(false);
        onReload(1);
    }, [onReload])


    const openEdit =useCallback (() => {
        setIsEditOpen(true);
    },[])

    const cancelEdit = useCallback(() => {
        setIsEditOpen(false);
        onReload(1)
    },[onReload])

    const confirmEdit = useCallback(() => {
        setIsEditOpen(false);
        onReload(1);
    }, [onReload])

    const onDeleteUser = useCallback((id: string) => {
        let payload = {}
        CommonService._api.delete(ENV.API_URL + 'candidate/' + id, payload).then(() => {
            init()
            onReload(1)
        }).catch((err)=>{
            CommonService.showToast(err?.error || 'Error', 'error');
        })
    },[onReload,init])


    const getUserDetails = useCallback((id:string)=>{
        CommonService._api.get(ENV.API_URL + 'candidate/' + id).then((resp) => {
           setCandidateDetails(resp?.data);
           console.log(resp?.data)
           openEdit()
        }).catch((err)=>{
            CommonService.showToast(err?.error || 'Error', 'error');
        })
    },[])

    return (
        <>
            <DialogComponent class={'dialog-side-wrapper'} open={isAddOpen} cancel={cancelAdd}>
                <UserAddComponent cancel={cancelAdd} confirm={confirmAdd} />
            </DialogComponent>
            <DialogComponent class={'dialog-side-wrapper'} open={isEditOpen} cancel={cancelEdit}>
                <UserEditComponent cancel={cancelEdit} confirm={confirmEdit} candidateDetails={candidateDetails}/>
            </DialogComponent>
            <div className={'user-list  screen crud-layout'}>
                <Paper className="paper">
                    <React.Fragment>
                        {list && list.table?._isDataLoading && <div className="table-loading-indicator">
                            <LinearProgress />
                        </div>}
                    </React.Fragment>
                    <div className="header">
                        <div className="filter">
                            <p className="count">{('Candidates')} <span className="table-count">(<span id="txt_user_count">{list?.table.pagination.totalItems}</span>)</span></p>
                        </div>
                        <div >
                        <div className="d-flex">
                            <div className="d-flex position-relative">
                            {!list?.table.filter.search?
                                <div className={"search_icon"}>
                                    <SearchIcon />
                                </div>:<div className={"search_icon"}><ClearIcon onClick={handleClearSearch} id="clear_user_search"/></div>}
                                <TextField defaultValue={''} className="search-cursor" id="input_search_user" onChange={event => {
                                    if (list && list.table) {
                                        list.table.filter.search = event.target.value;
                                        list.table.reload();
                                        list?.table.pageEvent(0)
                                        setPage(1)
                                    }
                                }} value={list?.table.filter.search} variant={"outlined"} size={"small"} type={'text'} placeholder={('Search Candidate')} />
                               </div>
                                <div>
                                 <div className="actions">
                                    <Button variant={"contained"} color="secondary" id="btn_add_user_list" className={"add-button"} onClick={openAdd}>
                                        <AddIcon/> &nbsp;&nbsp;{('ADD Candidate')}
                                    </Button>
                                </div>     
                                </div>
                               
                            </div>
                        </div>
                    </div>
                    {list && list.table && <>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        {list?.table.matColumns.map((column: any, columnIndex: any) => (
                                            <TableCell
                                                key={'header-col-' + columnIndex}
                                                className={ "table-left table-cell"}
                                            >
                                                {(column)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {list?.table.data.map((row: any, rowIndex: any) => {
                                        // console.log(row);
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={'row-' + rowIndex} className="table-row">
                                                <TableCell>
                                                {row['uid']}
                                                </TableCell>
                                                <TableCell>
                                                <p className="user-name">{row['name']?.length>25?row['name']?.slice(0,25)+"...":row['name']}</p>
                                                <p className="hide over-flow">{row['name']}</p>

                                                </TableCell>
                                                <TableCell>
                                                    {row['email']}
                                                </TableCell>
                                                <TableCell>
                                                    {row['phone']}
                                                </TableCell>
                                                 <TableCell>
                                                    {row['position']}
                                                </TableCell>
                                                <TableCell>
                                                    <Button id="btn_edit_user_list" className={"edit-button"} onClick={()=>getUserDetails(row["_id"])}>
                                                        <EditIcon/>
                                                    </Button>&nbsp;
                                                    <Button id="btn_delete_user_list" className={"delete-button"} onClick={() => onDeleteUser(row["_id"])}>
                                                        <DeleteIcon/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            <div className="no-data">
                                {
                                  !list.table?._isDataLoading && list?.table.data.length === 0 && <><h1>{('No Users added')}</h1><img src={no_data} alt="" /></>
                                }
                                </div>
                        </TableContainer>
                    </>
                    }
                </Paper>
                <Pagination className={"pagination"} count={list?.table?.pagination?.totalItems  ? Math.ceil(list?.table?.pagination?.totalItems / list?.table.pagination.pageSize) : 0}
                onChange={(event, pageNumber) => {list?.table.pageEvent(pageNumber - 1);
                    setPage(pageNumber)}} page={page} shape="rounded" color={"primary"} size="large" />
            </div>
        </>
    )
};
