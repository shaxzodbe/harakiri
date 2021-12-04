import React, {useEffect, useRef, useState} from "react"
import {
    Alert,
    ANDROID,
    Avatar,
    Button, CellButton,
    Checkbox,
    Div,
    File,
    FormItem,
    FormLayout,
    Group,
    Header,
    IconButton,
    Input,
    IOS,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    PanelHeaderButton,
    PanelHeaderClose, Placeholder,
    Progress,
    Radio,
    RichCell, Search,
    SimpleCell,
    Subhead,
    Textarea,
    Title,
    useAdaptivity,
    usePlatform,
    ViewWidth
} from "@vkontakte/vkui";
import $ from "jquery";
import {Icon24Dismiss, Icon24Document, Icon28DeleteOutline, Icon56SearchLikeOutline} from "@vkontakte/icons"
import Api from "../controllers/Api";
import Helper from "./Helper";
import {isArray} from "@vkontakte/vkjs";

const AdminModal = ({activeModal, NewsController, setManga, setAddNeGlav, addNewGlav, manga, UserController, MangaController, MangasController, setModal, setPop}) => {
    const ApiCtrl = new Api();
    const [archive, setArchive] = useState(null);
    const [mangaZav, setMangaZav] = useState("nezav");
    const [music, setMusic] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const {viewWidth} = useAdaptivity();
    const isMobile = viewWidth <= ViewWidth.MOBILE;
    const platform = usePlatform();
    const [adminAdd, setAdminAdd] = useState("admin");
    const [hasMusic, setHasMusic] = useState(false);
    const [addAdminUser, setAddAdminUser] = useState(null)
    const [creatorUsers, setCreatorUsers] = useState(null);
    const [search, setSearch] = useState("")
    const [allMangas, setAllMangas] = useState(null)
    const [allAdmins, setAllAdmins] = useState(null)
    const [allArticles, setAllArticles] = useState(null)
    const [persons, setPersons] = useState(null)

    const [activeManga, setActiveManga] = useState(null);
    const activeMangaRef = useRef();
    activeMangaRef.current = activeManga;
    const [activeGlav, setActiveGlav] = useState(null)
    const sendAdminLink = () => {
        let link = $("#admin_link").val();
        if (link && link.length > 0)
            ApiCtrl.post({type: "check_admin", link: link}).then((response) => {
                setAddAdminUser(response)
            })
    }
    const sendAdmin = () => {
        ApiCtrl.post({type: "add_admin", user: addAdminUser, role: adminAdd}).then((response) => {
            if (response.result) {
                setPop(resultApi("Админ добавлен"))
            } else {
                setPop(resultApi("Пользователь уже в администрации"))
            }
            $("#admin_link").val("")
        })

    }
    const geDefaultValue = (manga) => {
        if (manga.creators && manga.creators.length > 0) {
            let d = "";
            for (let i = 0; i < manga.creators.length; i++) {
                d += `https://vk.com/id${manga.creators[i].id}\n`
            }
            return d;
        } else return ""
    }
    const modalBack = () => {
        if (activeModal === "editGlav") {
            setActiveGlav(null)
            setArchive(null)
            setModal("editManga")
        } else {
            setAddNeGlav(false);
            setManga(null)
            clearInfo()
            setAddAdminUser(null)
            setModal(null)
        }

    }
    const loadingArxiv = (
        <div className={"popout_load_file"}>
            <div className={"pop_load_info"}>
                <Title className={"nu_Bold"} level="2" style={{textAlign: "center"}} weight="regular">
                    Загрузка файла
                </Title>
                <div className="progress_bar_load">
                    <Subhead
                        className={"nu_Semi_Bold articleName this_is_prog"} style={{textAlign: "center"}} level="3"
                        weight="regular">
                        0%
                    </Subhead>
                    <Progress className={"progress_pls"} value={0}/>
                </div>
            </div>
        </div>
    )
    const resultApi = (result) => {
        return (
            <div className={"popout_load_file"}>
                <div className={"pop_load_info"}>
                    <Title className={"nu_Bold"} level="2" style={{textAlign: "center"}} weight="regular">
                        {result}
                    </Title>
                    <Button onClick={() => {
                        setPop(null)
                        setAddAdminUser(null)
                    }}>Окей</Button>
                </div>
            </div>
        )
    }
    const glavArchiveUpload = (resut, glav_id) => {
        if(resut){
            MangasController.updateGlavPlease(resut ? resut.data.name : null, glav_id, activeManga._id, null, activeManga.glavs[glav_id].path.split("/")[2]);
            setTimeout(() => {
                setPop(null)
                setTimeout(() => {
                    setPop(resultApi("Глава обновлена !"))
                }, 300)
            }, 500)
        }else{

            setTimeout(() => {
                setPop(null)
                setTimeout(() => {
                    setPop(resultApi("Ошибка загрузки"))
                }, 300)
            }, 500)
        }

        //
    }

    const eprsonAvatarLoadedUpdate = (result, id) => {
        //setArchive(result)
        let pers = activeManga;
        pers.glavs[activeGlav].persons[id].photo = result.data.name;
        setActiveManga({...pers})
        setTimeout(() => {
            setPop(null)
        }, 500)
    }
    const eprsonAvatarLoaded = (result, id) => {
        //setArchive(result)
        let pers = persons;
        persons[id].photo = result.data.name;
        setPersons([...pers])
        setTimeout(() => {
            setPop(null)
        }, 500)
    }
    const archiveLoaded = (result) => {
        setArchive(result)
        setTimeout(() => {
            setPop(null)
        }, 500)
    }
    const avatarLoadedOk = (result) =>{
        MangasController.updateAvatarPls(result.data.name, activeManga._id).then((r)=>{
            let a = activeMangaRef.current;

            a.avatar = r.avatar;
            setActiveManga({...a})
                setPop(null)
                setTimeout(() => {
                    setPop(resultApi("Аватарка обновленна"))
                }, 300)
        });

    }
    const avatarLoaded = (result) => {
        setAvatar(result)
        setTimeout(() => {
            setPop(null)
        }, 500)
    }
    const musicLoaded = (result) => {
        setMusic(result)
        setTimeout(() => {
            setPop(null)
        }, 500)
    }
    const musicUploadOk = (resut, glav_id) => {
        MangasController.updateGlavPlease(activeManga.glavs[glav_id].path.split("/")[2], glav_id, activeManga._id, resut ? resut.data.name : null);
        setTimeout(() => {
            setPop(null)
            setTimeout(() => {
                setPop(resultApi("Глава обновлена !"))
            }, 300)
        }, 500)
    }
    const saveActiveManga = () => {
        MangasController.updateGlavPlease2(activeManga._id, activeManga.glavs[activeGlav].persons, activeManga.glavs[activeGlav].name,
            activeManga.glavs[activeGlav].hasOwnProperty("has_music") ? activeManga.glavs[activeGlav].has_music : false, activeGlav
        ).then(() => {
            setTimeout(() => {
                setPop(resultApi("Глава обновлена !"))
            }, 300)
        })
    }
    const arxivvLoad = (e) => {

        if (e.target.files.length > 0) {
            let data = e.currentTarget.dataset.what;
            let data_why = e.currentTarget.dataset.why;
            let data_id = parseInt(e.currentTarget.dataset.id);
            /*data-why={"updateglav"}
            data-id={activeGlav}*/
            let file = e.target.files[0];
            let formDta = new FormData();
            formDta.append("file", file);
            setPop(loadingArxiv)

            if (data_why && data_why === "updateglav") {
                ApiCtrl.uploadFile("upload_archive_glav", formDta, glavArchiveUpload, data_id)
            } else if (data_why && data_why === "person") {
                ApiCtrl.uploadFile("upload_archive", formDta, eprsonAvatarLoaded, data_id)
            } else if (data_why && data_why === "update_person") {
                ApiCtrl.uploadFile("upload_archive", formDta, eprsonAvatarLoadedUpdate, data_id)
            } else if (data_why && data_why === "music") {
                ApiCtrl.uploadFile("upload_archive", formDta, musicUploadOk, data_id)
            } else if (data_why && data_why === "avatar_up") {
                ApiCtrl.uploadFile("upload_archive", formDta, avatarLoadedOk, data_id)
            } else {
                if (data === "archive")
                    ApiCtrl.uploadFile("upload_archive", formDta, archiveLoaded)
                else if (data === "avatar")
                    ApiCtrl.uploadFile("upload_archive", formDta, avatarLoaded)
                else
                    ApiCtrl.uploadFile("upload_archive", formDta, musicLoaded)
            }

        }
        $("#arxiv_load_input").val("");
        $("#avatar_load_input").val("");
        $("#music_load").val("");
        //setPop(loadingArxiv)
    }
    const deleteAvatar = () => {
        ApiCtrl.post({type: "delete_archive", name: avatar.data.name})
        setAvatar(null)
    }
    const deleteMusic = () => {
        ApiCtrl.post({type: "delete_archive", name: music.data.name})
        setMusic(null)
    }
    const deleteArchive = () => {
        ApiCtrl.post({type: "delete_archive", name: archive.data.name})
        setArchive(null)
    }
    const getInfoAboutPeople = () => {
        let users = $("#who_is_creators").val();
        users = users.split("\n");
        if (users && users.length > 0) {
            ApiCtrl.post({type: "info_people", users: users}).then((response) => {
                setCreatorUsers(response)
            })
        }
    }
    const changeRoleInCreators = (id, e) => {
        let uu = creatorUsers;
        uu[id].role = e.currentTarget.value;
        setCreatorUsers([...uu])
    }
    const changePersonsDesc = (id, e) => {
        let uu = persons;
        uu[id].description = e.currentTarget.value;
        setPersons([...uu])
    }
    const changePersonsName = (id, e) => {
        let uu = persons;
        uu[id].name = e.currentTarget.value;
        setPersons([...uu])
    }
    const changePersonsPhoto = (id, e) => {
        let uu = persons;
        uu[id].photo = e.currentTarget.value;
        setPersons([...uu])
    }
    const saveManga = () => {
        let name_archive = archive ? archive.data.name : null;
        let name_avatar = avatar ? avatar.data.name : null;
        let name_manga = $("#manga_name").val()
        let manga_god = $("#manga_god").val()//Год выпуска
        let genre_manga = $("#genre_manga").val() ? $("#genre_manga").val().split(",") : []//Жанры
        let tags_manga = $("#tags_manga").val() ? $("#tags_manga").val().split(",") : []//теги
        let age_block = $("#age_block").val()//Возраст
        let glav_name = $("#glav_name").val()//Возраст
        let days_allow = $("#days_allow").val()//Возраст
        let music_has = hasMusic;//есть ли музыка
        let music_manga = null;
        if (hasMusic)
            music_manga = music ? music.data.name : null;//Имя архива с музыкой
        let description_manga = $("#description_manga").val()
        ApiCtrl.post({
            type: "add_manga",
            addNewGlav: addNewGlav,
            manga_id: manga ? manga._id : null,
            days_allow: days_allow,
            persons: persons,
            name_archive: name_archive,
            glav_name: glav_name,
            name_avatar: name_avatar,
            name_manga: name_manga,
            manga_god: manga_god,
            genre_manga: genre_manga,
            tags_manga: tags_manga,
            age_block: age_block,
            music_has: music_has,
            type_m: mangaZav,
            music_manga: music_manga,
            description_manga: description_manga,
            creatorUsers_manga: creatorUsers,//Инфа о создателях
        }).then((response) => {
            if (response.result) {
                setPop(resultApi("Манга добавлена!"))
                //clearInfo()
            } else {
                setPop(resultApi("Ошибка!"))
            }
        })
    }
    const clearInfo = () => {
        setArchive(null)
        setMusic(null)
        setAvatar(null)
        setHasMusic(false);
        setActiveManga(false);
        setCreatorUsers(false)
        setPersons(null)
    }
    const saveTextManga = () => {
        let name_avatar = avatar ? avatar.data.name : null;
        let name_manga = $("#manga_name").val()
        let manga_god = $("#manga_god").val()//Год выпуска
        let genre_manga = $("#genre_manga").val() ? $("#genre_manga").val().split(",") : []//Жанры
        let tags_manga = $("#tags_manga").val() ? $("#tags_manga").val().split(",") : []//теги
        let age_block = $("#age_block").val()//Возраст
        let description_manga = $("#description_manga").val()
        let glav_name = $("#glav_name").val()
        let name_of_glav = $("#name_of_glav").val();
        let glava_text = $("#glava_text").val();
        let days_allow = $("#days_allow").val()//Возраст
        ApiCtrl.post({
            type: "add_manga",
            text: true,
            addNewGlav: addNewGlav,
            days_allow: days_allow,

            manga_id: manga ? manga._id : null,
            glavs:
                {
                    name: name_of_glav,
                    text: glava_text
                }
            ,
            name_avatar: name_avatar,
            glav_name: glav_name,
            name_manga: name_manga,
            manga_god: manga_god,
            genre_manga: genre_manga,
            tags_manga: tags_manga,
            age_block: age_block,
            type_m: mangaZav,
            description_manga: description_manga,
        }).then((response) => {
            if (response.result) {
                setPop(resultApi("Манга добавлена!"))
                //clearInfo()
            } else {
                setPop(resultApi("Ошибка!"))
            }
        })
    }
    useEffect(() => {
        if (activeModal === "all_mangas") {
            MangasController.getAllMangas({}).then((r) => {
                setAllMangas(r)
            })
        } else if (activeModal === "all_admins") {
            UserController.getAllAdmins({}).then((r) => {
                setAllAdmins(r)
            })
        } else if (activeModal === "articles_modal") {
            MangasController.getArticles({}).then((r) => {
                setAllArticles(r)
            })
        }
    }, [activeModal])
    useEffect(() => {
        if (search) {
            MangasController.searchManga({search: search}).then((r) => {
                setAllMangas(r)
            })
        } else {
            MangasController.getAllMangas({}).then((r) => {
                setAllMangas(r)
            })
        }
    }, [search])
    const deleteAdmin = (id) => {
        UserController.deleteAdmin({admin_id: id}).then((r) => {
            setAllAdmins(r)
        })
    }
    const article = (e) => {
        let what = parseInt(e.currentTarget.dataset.what)
        let article_id = e.currentTarget.dataset.id

        MangasController.articleResh({what: what, article_id: article_id}).then((r) => {
            setAllArticles(r)
        })
    }
    const deleteManga = (item) => {
        MangasController.deleteManga({manga_id: item._id}).then((r) => {
            MangasController.getAllMangas({}).then((r) => {
                setAllMangas(r)
            })
        })
    }
    const addGlav = (item) => {
        setAddNeGlav(true);
        setManga(item)
        setModal(null)
        setTimeout(() => {
            if (item.text)
                setModal("add_text_manga")
            else
                setModal("add_manga")
        }, 200)
    }
    const saveStatii = () => {
        let name_avatar = avatar ? avatar.data.name : null;
        let name_new = $("#name_stii").val()
        let text_new = $("#text_stii").val()
        NewsController.saveNew({
            text: text_new,
            name: name_new,
            avatar: name_avatar
        }).then((response) => {
            if (response.result) {
                setPop(resultApi("Манга добавлена!"))
                //clearInfo()
            } else {
                setPop(resultApi("Ошибка!"))
            }
        })
    }
    const updateManga = () => {
        MangasController.updateManga({manga: activeManga});
        setPop(resultApi("Обновлено!"))
    }
    const editManga = (item) => {
        setActiveManga(item)
        setModal("editManga")
    }
    const updateTextManga = () => {
        MangasController.updateManga({manga: activeManga, text: true});
        setPop(resultApi("Обновлено!"))
    }
    return (
        <ModalRoot
            activeModal={activeModal}
            onClose={modalBack}
        >

            <ModalPage
                id={"add_manga"}
                onClose={modalBack}

                dynamicContentHeight
                header={
                    <ModalPageHeader
                        right={isMobile && platform === IOS &&
                        <PanelHeaderButton onClick={modalBack}><Icon24Dismiss/></PanelHeaderButton>}
                        left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={modalBack}/>}
                    >

                    </ModalPageHeader>
                }
            >
                <Div>
                    {addNewGlav && <FormItem top="Загрузите архив">
                        <File
                            data-what={"archive"}
                            accept=".zip"
                            id={"arxiv_load_input"}
                            onChange={arxivvLoad}
                            before={<Icon24Document/>}
                            controlSize="l" mode="secondary"/>
                    </FormItem>}
                    {archive &&
                    <FormItem top={"Вы уже загрузили архив"}>
                        <SimpleCell after={<IconButton
                            onClick={deleteArchive}
                        ><Icon28DeleteOutline fill={"red"}/></IconButton>}>{archive.data.name}</SimpleCell>
                    </FormItem>
                    }

                    <FormItem top="Загрузите аватарку">
                        <File
                            data-what={"avatar"}
                            onChange={arxivvLoad}
                            accept=".jpg,.jpeg,.png"
                            id={"avatar_load_input"}
                            before={<Icon24Document/>}
                            stetched controlSize="l" mode="secondary"/>
                    </FormItem>
                    {avatar &&
                    <FormItem top={"Вы уже загрузили аватарку"}>
                        <div className={"avatar_preview"}>
                            <img width={80} src={ApiCtrl.imgUrl + "/" + avatar.data.name}/>
                            <IconButton
                                onClick={deleteAvatar}
                            ><Icon28DeleteOutline fill={"red"}/></IconButton>
                        </div>
                    </FormItem>
                    }
                    {!addNewGlav &&
                    <FormLayout>
                        <FormItem top="Раздел">
                            <Radio onChange={() => setMangaZav("fox")}
                                   checked={mangaZav === "fox"} name="radio" value="admin"
                                   defaultChecked>
                                Fox Comics
                            </Radio>
                            <Radio onChange={() => setMangaZav("nezav")}
                                   checked={mangaZav === "nezav"} name="radio"
                                   value="nezav">Независимые</Radio>
                            <Radio onChange={() => setMangaZav("books")}
                                   checked={mangaZav === "books"} name="radio"
                                   value="editor">Книжная полка</Radio>
                        </FormItem>
                    </FormLayout>
                    }

                    {addNewGlav && <FormItem top="Название главы">
                        <Input id={"glav_name"} placeholder={"Глава 1. О о О о О"}/>
                    </FormItem>}
                    {!addNewGlav &&
                    <div>
                        <FormItem top="Название манги">
                            <Input id={"manga_name"} placeholder={"Тетрадь смерти"}/>
                        </FormItem>
                        <FormItem top="Год выпуска">
                            <Input id={"manga_god"} placeholder={"2021"}/>
                        </FormItem>
                        <FormItem top="Жанр (через запятую если их несколько, 1 жанр главный)">
                            <Input id={"genre_manga"} placeholder={"Комедия,ужас"}/>
                        </FormItem>
                        <FormItem top="Теги (через запятую если их несколько)">
                            <Input id={"tags_manga"} placeholder={"манга,манга"}/>
                        </FormItem>
                        <FormItem top="Оптимальный возраст для чтения">
                            <Input id={"age_block"} placeholder={"16+"}/>
                        </FormItem>
                    </div>
                    }
                    {addNewGlav &&
                    <FormItem top="Через сколько дней будет доступно для всех ?">
                        <Input id={"days_allow"} placeholder={"1"}/>
                    </FormItem>
                    }
                    {addNewGlav && <FormItem>
                        <Checkbox checked={hasMusic} onChange={() => setHasMusic(prevState => !prevState)}>Есть
                            музыка</Checkbox>
                    </FormItem>}
                    {hasMusic &&
                    <FormItem top="Загрузите архив с музыкой">
                        <File
                            accept=".zip"
                            id={"music_load"}
                            data-what={"music"}
                            onChange={arxivvLoad}
                            before={<Icon24Document/>} stetched controlSize="l" mode="secondary"/>
                    </FormItem>
                    }

                    {hasMusic && music &&
                    <FormItem top={"Вы уже загрузили архив c музыкой"}>
                        <SimpleCell after={<IconButton
                            onClick={deleteMusic}
                        ><Icon28DeleteOutline fill={"red"}/></IconButton>}>{music.data.name}</SimpleCell>
                    </FormItem>
                    }
                    {!addNewGlav &&
                    <div>
                        <FormItem top="Описание">
                            <Textarea id={"description_manga"} placeholder={"Крутая манга"}/>
                        </FormItem>
                        <FormItem top="Кто работал над проектом">
                            <Textarea
                                id={"who_is_creators"}
                                placeholder={"Впишите ссылки вк на людей, каждый новый человек с новой строки. После нажмите кнопку ниже"}/>
                            <Button onClick={getInfoAboutPeople} size={"m"} style={{marginTop: 5}}>Ввести</Button>
                        </FormItem>
                    </div>
                    }
                    {addNewGlav && <Group header={
                        <Header>
                            Добавьте персонажей этой главы
                        </Header>
                    }>
                        {persons && persons.map((item, key) => (
                            <RichCell
                                key={key}
                                disabled
                                multiline
                                before={<Avatar size={72}
                                                src={item.hasOwnProperty("photo") && (ApiCtrl.imgUrl + "/" + persons[key].photo)}/>}
                                actions={
                                    <React.Fragment>
                                        <div className={"admin_add_admin"}>
                                            <FormItem top="Имя">
                                                <Input value={persons[key].hasOwnProperty("name") ?
                                                    persons[key].name : ""}
                                                       onChange={(e) => changePersonsName(key, e)}
                                                       placeholder={"бла бла бла"}/>
                                            </FormItem>
                                            <FormItem top="Описание">
                                                <Input value={persons[key].hasOwnProperty("description") ?
                                                    persons[key].description : ""}
                                                       onChange={(e) => changePersonsDesc(key, e)}
                                                       placeholder={"бла бла бла"}/>
                                            </FormItem>
                                            {/* <FormItem top="Ссылка на фото">
                                                <Input value={persons[key].hasOwnProperty("photo") ?
                                                    persons[key].photo : ""}
                                                       onChange={(e) => changePersonsPhoto(key, e)}
                                                       placeholder={"Сценарист"}/>
                                            </FormItem>*/}
                                            <FormItem top="Загрузите аватарку">
                                                <File
                                                    data-what={"avatar"}
                                                    data-why={"person"}
                                                    data-id={key}
                                                    onChange={arxivvLoad}
                                                    accept=".jpg,.jpeg,.png"
                                                    id={"avatar_load_input"}
                                                    before={<Icon24Document/>}
                                                    stetched controlSize="l" mode="secondary"/>
                                            </FormItem>
                                            <Button onClick={() => {
                                                let j = persons;
                                                j.splice(key, 1);
                                                setPersons([...j])
                                            }} mode={"destructive"}>Удалить</Button>
                                        </div>


                                    </React.Fragment>
                                }
                            >
                                {item.first_name} {item.last_name}
                            </RichCell>
                        ))}
                        <Button onClick={() => {
                            let uuu = persons;
                            if (!uuu)
                                uuu = []
                            uuu.push({})
                            setPersons([...uuu])
                        }}>Добавить персонажа</Button>
                    </Group>}

                    {creatorUsers && creatorUsers.length > 0 &&
                    <Group header={<Header>Впишите роли</Header>}>
                        {creatorUsers.map((item, key) => (
                            <RichCell
                                key={key}
                                disabled
                                multiline
                                before={<Avatar size={72} src={item.photo_100}/>}
                                actions={
                                    <React.Fragment>
                                        <div className={"admin_add_admin"}>
                                            <FormItem top="Роль">
                                                <Input value={creatorUsers[key].hasOwnProperty("role") ?
                                                    creatorUsers[key].role : ""}
                                                       onChange={(e) => changeRoleInCreators(key, e)}
                                                       placeholder={"Сценарист"}/>
                                            </FormItem>
                                        </div>


                                    </React.Fragment>
                                }
                            >
                                {item.first_name} {item.last_name}
                            </RichCell>
                        ))}
                    </Group>}
                    <Button style={{marginTop: 20}} mode="commerce" onClick={saveManga} stretched
                            size={"l"}>Сохранить</Button>
                    {addNewGlav &&
                    <div style={{height: 300}}/>
                    }
                </Div>

            </ModalPage>
            <ModalPage
                id={"add_text_manga"}
                onClose={modalBack}
                dynamicContentHeight
                header={
                    <ModalPageHeader
                        right={isMobile && platform === IOS &&
                        <PanelHeaderButton onClick={modalBack}><Icon24Dismiss/></PanelHeaderButton>}
                        left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={modalBack}/>}
                    >

                    </ModalPageHeader>
                }
            >
                <Div>
                    <FormItem top="Загрузите аватарку">
                        <File
                            data-what={"avatar"}
                            onChange={arxivvLoad}
                            accept=".jpg,.jpeg,.png"
                            id={"avatar_load_input"}
                            before={<Icon24Document/>}
                            stetched controlSize="l" mode="secondary"/>
                    </FormItem>
                    {avatar &&
                    <FormItem top={"Вы уже загрузили аватарку"}>
                        <div className={"avatar_preview"}>
                            <img width={80} src={ApiCtrl.imgUrl + "/" + avatar.data.name}/>
                            <IconButton
                                onClick={deleteAvatar}
                            ><Icon28DeleteOutline fill={"red"}/></IconButton>
                        </div>
                    </FormItem>


                    }
                    {!addNewGlav &&
                    <FormLayout>
                        <FormItem top="Раздел">
                            <Radio onChange={() => setMangaZav("fox")}
                                   checked={mangaZav === "fox"} name="radio" value="admin"
                                   defaultChecked>
                                Fox Comics
                            </Radio>
                            <Radio onChange={() => setMangaZav("editor")}
                                   checked={mangaZav === "nezav"} name="radio"
                                   value="editor">Независимые</Radio>
                            <Radio onChange={() => setMangaZav("books")}
                                   checked={mangaZav === "books"} name="radio"
                                   value="editor">Книжная полка</Radio>
                        </FormItem>
                    </FormLayout>
                    }

                    <FormItem top="Название главы">
                        <Input id={"glav_name"} placeholder={"Глава 1. О о О о О"}/>
                    </FormItem>
                    {!addNewGlav &&
                    <div>
                        <FormItem top="Название манги">
                            <Input id={"manga_name"} placeholder={"Тетрадь смерти"}/>
                        </FormItem>
                        <FormItem top="Год выпуска">
                            <Input id={"manga_god"} placeholder={"2021"}/>
                        </FormItem>
                        <FormItem top="Жанр (через запятую если их несколько, 1 жанр главный)">
                            <Input id={"genre_manga"} placeholder={"Комедия,ужас"}/>
                        </FormItem>
                        <FormItem top="Теги (через запятую если их несколько)">
                            <Input id={"tags_manga"} placeholder={"манга,манга"}/>
                        </FormItem>
                        <FormItem top="Оптимальный возраст для чтения">
                            <Input id={"age_block"} placeholder={"16+"}/>
                        </FormItem>

                        <FormItem top="Описание">
                            <Textarea id={"description_manga"} placeholder={"Крутая манга"}/>
                        </FormItem>
                        <FormItem top="Название главы">
                            <Input id={"name_of_glav"} placeholder={"Глава 1. В которой всё начинается"}/>
                        </FormItem>
                    </div>

                    }
                    <FormItem top="Сам текст ">
                        <Textarea id={"glava_text"}
                                  placeholder={"В которой всё начинается В которой всё прпрппп начинается В которой всё начинается В которой всё начинается В которой всё начинается В пппп В которой всё начинается В которой всё прпрппп начинается В которой всё начинается В которой всё начинается В которой всё начинается В пппп "}/>
                    </FormItem>
                    {addNewGlav &&
                    <FormItem top="Через сколько дней будет доступно для всех ?">
                        <Input id={"days_allow"} placeholder={"1"}/>
                    </FormItem>
                    }
                    <Button style={{marginTop: 20}} mode="commerce" onClick={saveTextManga} stretched
                            size={"l"}>Сохранить</Button>
                </Div>

            </ModalPage>
            <ModalPage
                id={"add_admins"}
                onClose={modalBack}
                settlingHeight={100}
                header={
                    <ModalPageHeader
                        right={isMobile && platform === IOS &&
                        <PanelHeaderButton onClick={modalBack}><Icon24Dismiss/></PanelHeaderButton>}
                        left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={modalBack}/>}
                    >

                    </ModalPageHeader>
                }
            >
                <Div>

                    <FormItem top="Введите ссылку на человека">
                        <Input id={"admin_link"} placeholder={"https://vk.com/imnot.nastya"}/>
                    </FormItem>
                    <Button onClick={sendAdminLink} style={{width: "100%"}} size={"l"}>
                        Отправить
                    </Button>
                    {addAdminUser &&
                    <Group
                        style={{marginTop: 50}}
                        header={<Header>Нашли человека</Header>}
                    >
                        <RichCell

                            disabled
                            multiline
                            before={<Avatar size={72} src={addAdminUser.photo_100}/>}
                            text={<span style={{color: "red"}}>Выберите роль для челвоека и нажмите - добавить, или введите новую ссылку</span>}
                            actions={
                                <React.Fragment>
                                    <div className={"admin_add_admin"}>
                                        <FormLayout>
                                            <FormItem top="Роль">
                                                <Radio onChange={() => setAdminAdd("admin")}
                                                       checked={adminAdd === "admin"} name="radio" value="admin"
                                                       defaultChecked>
                                                    Администратор
                                                </Radio>
                                                <Radio onChange={() => setAdminAdd("editor")}
                                                       checked={adminAdd === "editor"} name="radio"
                                                       value="editor">Редактор</Radio>
                                            </FormItem>
                                        </FormLayout>
                                        <Button onClick={sendAdmin}>Добавить</Button>
                                    </div>


                                </React.Fragment>
                            }
                        >
                            {addAdminUser.first_name} {addAdminUser.last_name}
                        </RichCell>
                    </Group>
                    }


                </Div>

            </ModalPage>
            <ModalPage
                id={"all_mangas"}
                onClose={modalBack}
                settlingHeight={100}
                header={
                    <ModalPageHeader
                        right={isMobile && platform === IOS &&
                        <PanelHeaderButton onClick={modalBack}><Icon24Dismiss/></PanelHeaderButton>}
                        left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={modalBack}/>}
                    >

                    </ModalPageHeader>
                }
            >
                <Div>
                    <Search value={search} onChange={(e) => setSearch(e.currentTarget.value)}
                            placeholder={"Ищем мангу"}/>
                    <Group>
                        {allMangas && allMangas.map((item) => (
                            <div className="adminManga">
                                <img
                                    src={`https://foxcomics.ru${item.avatar && item.avatar.substring(2).split(' ').join("%20")}`}/>

                                <Subhead className={"nu_Semi_Bold"} weight="regular">{item.name}</Subhead>
                                <div className="adminMangaButton">
                                    <Button onClick={() => addGlav(item)} style={{marginBottom: 10}}>Добавить
                                        главу</Button>
                                    <Button mode={"commerce"}
                                            onClick={() => editManga(item)}
                                            style={{marginBottom: 10}}>Редактировать</Button>
                                    <Button onClick={() => deleteManga(item)} mode={"destructive"}>Удалить</Button>
                                </div>
                            </div>
                        ))

                        }
                    </Group>
                </Div>
            </ModalPage>
            <ModalPage
                id={"all_admins"}
                onClose={modalBack}
                settlingHeight={100}
                header={
                    <ModalPageHeader
                        right={isMobile && platform === IOS &&
                        <PanelHeaderButton onClick={modalBack}><Icon24Dismiss/></PanelHeaderButton>}
                        left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={modalBack}/>}
                    >

                    </ModalPageHeader>
                }>
                <Div>
                    <Group>
                        {allAdmins && allAdmins.map((item) => (
                            <div className="adminManga">
                                <img src={item.photo_100}/>

                                <Subhead className={"nu_Semi_Bold"}
                                         weight="regular">{item.first_name} {item.last_name} - {item.role}</Subhead>
                                <div className="adminMangaButton">
                                    <Button onClick={() => deleteAdmin(item._id)} style={{marginBottom: 10}}
                                            mode={"destructive"}>Разжаловать</Button>
                                </div>
                            </div>
                        ))

                        }
                    </Group>
                </Div>
            </ModalPage>
            <ModalPage
                id={"articles_modal"}
                onClose={modalBack}
                settlingHeight={100}
                header={
                    <ModalPageHeader
                        right={isMobile && platform === IOS &&
                        <PanelHeaderButton onClick={modalBack}><Icon24Dismiss/></PanelHeaderButton>}
                        left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={modalBack}/>}
                    >

                    </ModalPageHeader>
                }>
                <Div>
                    <Group>
                        {allArticles && allArticles.length > 0 && allArticles.map((item) => (
                            <div className="rez_block_admin">
                                <div className="rez_block">
                                    <div className="rez_photo">
                                        <Avatar size={54} className={"avatar_people"}
                                                src={item.user.photo_100}/>
                                        <div className="rez_photo_line red"/>
                                    </div>
                                    <div className="rez_info">
                                        <div className="rez_info_name">
                                            <Subhead className={"nu_Bold"} weight="regular"
                                                     style={{color: "#99A2AD"}}>{item.user.name}</Subhead>
                                            <Subhead className={"nu_Semi_Bold"} weight="regular"
                                                     style={{color: "#99A2AD"}}>{MangaController.getNormalDate(item.when_created)}</Subhead>
                                        </div>
                                        <div className="rez_info_rez">
                                            <div className="eclips">
                                                <Title style={{marginBottom: 10}}
                                                       className={"nu_Extra_Bold dsdsd"} level="2"
                                                       weight="regular">{item.name}</Title>
                                            </div>
                                            <Subhead
                                                style={{textAlign: "left", marginTop: 2, marginBottom: 2}}
                                                className={"nu_Semi_Bold articleName"} level="3"
                                                weight="regular">{item.article}</Subhead>

                                        </div>
                                    </div>
                                </div>
                                <div className={"adminMangaButton"}>
                                    <Button onClick={article} data-id={item._id} data-what={1}
                                            style={{marginBottom: 10}}>Одобрить</Button>
                                    <Button onClick={article} data-id={item._id} data-what={-1}
                                            mode={"destructive"}>Удалить</Button>
                                </div>
                            </div>

                        ))}
                        {allArticles && allArticles.length === 0 &&
                        <Placeholder
                            icon={<Icon56SearchLikeOutline fill={"#937FF5"}/>}
                            header={"Упс..."}
                        >
                            Ничего не найдено
                        </Placeholder>
                        }
                    </Group>
                </Div>
            </ModalPage>
            <ModalPage
                id={"statii"}
                onClose={modalBack}
                dynamicContentHeight={true}
                header={
                    <ModalPageHeader
                        right={isMobile && platform === IOS &&
                        <PanelHeaderButton onClick={modalBack}><Icon24Dismiss/></PanelHeaderButton>}
                        left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={modalBack}/>}
                    >

                    </ModalPageHeader>
                }>
                <Div>
                    <FormItem top="Загрузите аватарку">
                        <File
                            data-what={"avatar"}
                            onChange={arxivvLoad}
                            accept=".jpg,.jpeg,.png,.gif"
                            id={"avatar_load_input"}
                            before={<Icon24Document/>}
                            stetched controlSize="l" mode="secondary"/>
                    </FormItem>
                    {avatar &&
                    <FormItem top={"Вы уже загрузили аватарку"}>
                        <div className={"avatar_preview"}>
                            <img width={80} src={ApiCtrl.imgUrl + "/" + avatar.data.name}/>
                            <IconButton
                                onClick={deleteAvatar}
                            ><Icon28DeleteOutline fill={"red"}/></IconButton>
                        </div>
                    </FormItem>
                    }
                    <FormItem top={"Имя статьи"}>
                        <Input placeholder={"Был прекрасный день, мы радовались..."} id={"name_stii"}/>
                    </FormItem>
                    <FormItem top={"Текстик сюда"}>
                        <Textarea placeholder={"Был прекрасный день, мы радовались..."} id={"text_stii"}/>
                    </FormItem>
                    <Button onClick={saveStatii}>Сохранить статейку</Button>
                    <div style={{height: 200}}/>
                </Div>
            </ModalPage>
            <ModalPage
                id={"editManga"}
                onClose={modalBack}
                dynamicContentHeight={true}
                header={
                    <ModalPageHeader
                        right={isMobile && platform === IOS &&
                        <PanelHeaderButton onClick={modalBack}><Icon24Dismiss/></PanelHeaderButton>}
                        left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={modalBack}/>}
                    >

                    </ModalPageHeader>
                }>
                {activeManga &&
                <Div>
                    <FormLayout>
                        <FormItem top="Загрузите аватарку">
                            <File
                                data-what={"avatar"}
                                data-why={"avatar_up"}
                                onChange={arxivvLoad}
                                accept=".jpg,.jpeg,.png"
                                id={"avatar_load_input"}
                                before={<Icon24Document/>}
                                stetched controlSize="l" mode="secondary"/>
                        </FormItem>
                        {activeManga &&
                        <FormItem top={"Вы уже загрузили аватарку"}>
                            <div className={"avatar_preview"}>
                                <img width={80}
                                     src={`https://foxcomics.ru${activeManga.avatar && activeManga.avatar.substring(2).split(' ').join("%20")}`}/>

                            </div>
                        </FormItem>
                        }
                        <FormItem top="Раздел">
                            <Radio onChange={() => {
                                let j = activeManga
                                j.type = "fox";
                                setActiveManga({...j})
                            }}
                                   checked={activeManga.type === "fox"} name="radio" value="admin"
                                   defaultChecked>
                                Fox Comics
                            </Radio>
                            <Radio onChange={() => {
                                let j = activeManga
                                j.type = "nezav";
                                setActiveManga({...j})
                            }}
                                   checked={activeManga.type === "nezav"} name="radio"
                                   value="editor">Независимые</Radio>
                            <Radio onChange={() => {
                                let j = activeManga
                                j.type = "books";
                                setActiveManga({...j})
                            }}
                                   checked={activeManga.type === "books"} name="radio"
                                   value="editor">Книжная полка</Radio>
                        </FormItem>
                    </FormLayout>

                    <div>
                        <FormItem top="Название манги">
                            <Input onChange={(e) => {
                                let j = activeManga
                                j.name = e.currentTarget.value;
                                setActiveManga({...j})
                            }} value={activeManga.name} id={"manga_name"} placeholder={"Тетрадь смерти"}/>
                        </FormItem>
                        <FormItem top="Год выпуска">
                            <Input onChange={(e) => {
                                let j = activeManga
                                j.year = e.currentTarget.value;
                                setActiveManga({...j})
                            }} value={activeManga.year} id={"manga_god"} placeholder={"2021"}/>
                        </FormItem>
                        <FormItem top="Жанр (через запятую если их несколько, 1 жанр главный)">
                            <Input onChange={(e) => {
                                let j = activeManga
                                j.genre = e.currentTarget.value.trim().split(",");
                                setActiveManga({...j})
                            }} value={activeManga.genre.join(",")} id={"genre_manga"} placeholder={"Комедия,ужас"}/>
                        </FormItem>
                        <FormItem top="Теги (через запятую если их несколько)">
                            <Input onChange={(e) => {
                                let j = activeManga
                                j.tags = e.currentTarget.value.trim().split(",");
                                setActiveManga({...j})
                            }} value={activeManga.tags.join(",")} id={"tags_manga"} placeholder={"манга,манга"}/>
                        </FormItem>
                        <FormItem top="Оптимальный возраст для чтения">
                            <Input onChange={(e) => {
                                let j = activeManga
                                j.age = e.currentTarget.value
                                setActiveManga({...j})
                            }} value={activeManga.age} id={"age_block"} placeholder={"16+"}/>
                        </FormItem>
                    </div>


                    <div>
                        <FormItem top="Описание">
                            <Textarea onChange={(e) => {
                                let j = activeManga
                                j.description = e.currentTarget.value
                                setActiveManga({...j})
                            }} value={activeManga.description} id={"description_manga"} placeholder={"Крутая манга"}/>
                        </FormItem>

                    </div>
                    <Group header={<Header>Главы</Header>} className="admin_glavs">
                        {activeManga.glavs.map((item, key) => (
                            <div key={key} className="glava_block admidn">
                                <CellButton className="glava_block adsadqwe">
                                    <div style={{width: 120}} className="glav_info">
                                        <Title style={{padding: 0}} className="tight_title this_is_title nu_Bold d24"
                                               level={3}
                                               weight>{item.name}</Title>

                                    </div>
                                </CellButton>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <Button onClick={() => {
                                        setActiveGlav(key)
                                        setModal("editGlav")
                                    }} mode={"commerce"}>Редактировать</Button>
                                    <Button onClick={() => {
                                        let j = activeManga
                                        j.glavs.splice(key, 1)
                                        setActiveManga({...j})
                                    }} mode={"destructive"}>Удалить</Button>
                                </div>

                            </div>
                        ))}
                    </Group>
                    {activeManga &&
                    <FormItem top="Кто работал над проектом">
                        <Textarea
                            id={"who_is_creators2"}
                            defaultValue={geDefaultValue(activeManga)}
                            placeholder={"Впишите ссылки вк на людей, каждый новый человек с новой строки. После нажмите кнопку ниже"}/>
                        <Button onClick={() => {
                            let users = $("#who_is_creators2").val();
                            users = users.split("\n");
                            if (users && users.length > 0) {
                                ApiCtrl.post({type: "info_people", users: users}).then((response) => {
                                    let dad = activeMangaRef.current;
                                    dad.creators = response;
                                    setActiveManga({...dad})
                                })
                            }
                        }} size={"m"} style={{marginTop: 5}}>Ввести</Button>
                    </FormItem>
                    }
                    {activeManga && activeManga.creators && activeManga.creators.length > 0 &&
                    <Group header={<Header>Впишите роли</Header>}>
                        {activeManga.creators.map((item, key) => (
                            <RichCell
                                key={key}
                                disabled
                                multiline
                                before={<Avatar size={72} src={item.photo_100}/>}
                                actions={
                                    <React.Fragment>
                                        <div className={"admin_add_admin"}>
                                            <FormItem top="Роль">
                                                <Input value={activeManga.creators[key].hasOwnProperty("role") ?
                                                    activeManga.creators[key].role : ""}
                                                       onChange={(e) => {
                                                           let uu = activeManga;
                                                           uu.creators[key].role = e.currentTarget.value;
                                                           setActiveManga({...uu})
                                                       }}
                                                       placeholder={"Сценарист"}/>
                                            </FormItem>
                                            <Button onClick={() => {
                                                let uu = activeManga;
                                                uu.creators.splice(key, 1)
                                                setActiveManga({...uu})
                                            }} mode={"destructive"}>Удалить</Button>
                                        </div>


                                    </React.Fragment>
                                }
                            >
                                {item.first_name} {item.last_name}
                            </RichCell>
                        ))}
                    </Group>}
                    <Button style={{marginTop: 20}} mode="commerce" onClick={updateManga} stretched
                            size={"l"}>Сохранить</Button>

                </Div>
                }
            </ModalPage>
            <ModalPage id={"editGlav"}
                       onClose={modalBack}
                       dynamicContentHeight={true}
                       header={
                           <ModalPageHeader
                               right={isMobile && platform === IOS &&
                               <PanelHeaderButton onClick={modalBack}><Icon24Dismiss/></PanelHeaderButton>}
                               left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={modalBack}/>}
                           >

                           </ModalPageHeader>
                       }>

                <div>

                    {activeManga && activeGlav !== null && !activeManga.hasOwnProperty("text") &&
                    <Group
                        header={<Header multiline={true}>Загрузите новый архив. P.S. Как только выберите файл, он сразу
                            загрузиться в мангу, без подтверждения </Header>}>
                        <FormItem top="Загрузите архив">
                            <File
                                data-what={"archive"}
                                data-why={"updateglav"}
                                data-id={activeGlav}
                                accept=".zip"
                                id={"arxiv_load_input"}
                                onChange={arxivvLoad}
                                before={<Icon24Document/>}
                                controlSize="l" mode="secondary"/>
                        </FormItem>
                        {archive &&
                        <FormItem top={"Вы уже загрузили архив"}>
                            <SimpleCell after={<IconButton
                                onClick={deleteArchive}
                            ><Icon28DeleteOutline fill={"red"}/></IconButton>}>{archive.data.name}</SimpleCell>
                        </FormItem>
                        }
                        <FormItem>
                            <Checkbox checked={activeManga.glavs[activeGlav].has_music} onChange={() => {
                                let n = activeManga;
                                n.glavs[activeGlav].has_music = !n.glavs[activeGlav].has_music;
                                setActiveManga({...n})
                            }}>Есть
                                музыка</Checkbox>
                        </FormItem>
                        {activeManga.glavs[activeGlav].has_music &&
                        <FormItem top="Загрузите архив с музыкой">
                            <File
                                data-what={"music"}
                                data-why={"music"}
                                data-id={activeGlav}
                                accept=".zip"
                                id={"music_load"}
                                onChange={arxivvLoad}
                                before={<Icon24Document/>} stetched controlSize="l" mode="secondary"/>
                        </FormItem>
                        }
                        <FormItem top="Название главы">
                            <Input value={activeManga.glavs[activeGlav].name} onChange={(e) => {
                                let n = activeManga;
                                n.glavs[activeGlav].name = e.currentTarget.value;
                                setActiveManga({...n})
                            }} id={"glav_name"} placeholder={"Глава 1. О о О о О"}/>
                        </FormItem>
                        <Group header={
                            <Header>
                                Добавьте персонажей этой главы
                            </Header>
                        }>
                            {activeManga.glavs[activeGlav].persons && activeManga.glavs[activeGlav].persons.map((item, key) => (
                                <RichCell
                                    key={key}
                                    disabled
                                    multiline
                                    before={<Avatar size={72}
                                                    src={item.hasOwnProperty("photo") && (ApiCtrl.imgUrl + "/" + item.photo)}/>}
                                    actions={
                                        <React.Fragment>
                                            <div className={"admin_add_admin"}>
                                                <FormItem top="Имя">
                                                    <Input value={item.hasOwnProperty("name") ?
                                                        item.name : ""}
                                                           onChange={(e) => {
                                                               let n = activeManga;
                                                               n.glavs[activeGlav].persons[key].name = e.currentTarget.value;
                                                               setActiveManga({...n})
                                                           }}
                                                           placeholder={"бла бла бла"}/>
                                                </FormItem>
                                                <FormItem top="Описание">
                                                    <Input value={item.hasOwnProperty("description") ?
                                                        item.description : ""}
                                                           onChange={(e) => {
                                                               let n = activeManga;
                                                               n.glavs[activeGlav].persons[key].description = e.currentTarget.value;
                                                               setActiveManga({...n})
                                                           }}
                                                           placeholder={"бла бла бла"}/>
                                                </FormItem>
                                                <FormItem top="Загрузите аватарку">
                                                    <File
                                                        data-what={"avatar"}
                                                        data-why={"update_person"}
                                                        data-id={key}
                                                        onChange={arxivvLoad}
                                                        accept=".jpg,.jpeg,.png"
                                                        id={"avatar_load_input"}
                                                        before={<Icon24Document/>}
                                                        stetched controlSize="l" mode="secondary"/>
                                                </FormItem>
                                                <Button onClick={() => {
                                                    let n = activeManga;
                                                    n.glavs[activeGlav].persons.splice(key, 1);
                                                    setActiveManga({...n})
                                                }} mode={"destructive"}>Удалить</Button>
                                            </div>


                                        </React.Fragment>
                                    }
                                >
                                    {item.first_name} {item.last_name}
                                </RichCell>
                            ))}
                            <Button onClick={() => {
                                let n = activeManga;
                                if (n.glavs[activeGlav].hasOwnProperty("persons") && isArray(n.glavs[activeGlav].persons))
                                    n.glavs[activeGlav].persons.push({});
                                else n.glavs[activeGlav].persons = [{}];
                                setActiveManga({...n})
                            }}>Добавить персонажа</Button>
                            <Button onClick={saveActiveManga} stretched={true} mode={"commerce"}>Сохранить
                                обновления</Button>
                        </Group>
                    </Group>
                    }
                    {activeManga && activeGlav !== null && activeManga.hasOwnProperty("text") &&
                    <Group
                        header={<Header multiline={true}>Редактирование главы - {activeGlav + 1}</Header>}>
                        <FormItem top="Название главы">
                            <Input onChange={(e) => {
                                let j = activeManga
                                j.glavs[activeGlav].name = e.currentTarget.value
                                setActiveManga({...j})
                            }} value={activeManga.glavs[activeGlav].name} id={"name_of_glav"}
                                   placeholder={"Глава 1. В которой всё начинается"}/>
                        </FormItem>

                        <FormItem top="Сам текст ">
                            <Textarea onChange={(e) => {
                                let j = activeManga
                                j.glavs[activeGlav].text = e.currentTarget.value
                                setActiveManga({...j})
                            }} value={activeManga.glavs[activeGlav].text} id={"glava_text"}
                                      placeholder={"В которой всё начинается В которой всё прпрппп начинается В которой всё начинается В которой всё начинается В которой всё начинается В пппп В которой всё начинается В которой всё прпрппп начинается В которой всё начинается В которой всё начинается В которой всё начинается В пппп "}/>
                        </FormItem>

                        <Button style={{marginTop: 20}} mode="commerce" onClick={updateTextManga} stretched
                                size={"l"}>Сохранить</Button>
                    </Group>
                    }

                </div>

            </ModalPage>
        </ModalRoot>
    )

}
export default AdminModal;