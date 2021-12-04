import React, {useState, useEffect, Fragment} from "react"
import {Icon20LockOutline, Icon28HideOutline, Icon28ViewOutline} from '@vkontakte/icons';
import {
    HorizontalCell,
    Panel,
    PanelHeader,
    Div,
    Title,
    Subhead,
    Button,
    Tabs,
    TabsItem,
    Separator,
    Header,
    Avatar,
    HorizontalScroll,
    Group,
    View,
    Input,
    IconButton,
    WriteBar,
    WriteBarIcon,

    FormItem, Gallery, CellButton
} from "@vkontakte/vkui";
import {Icon28BlockOutline} from '@vkontakte/icons';
import {Icon28DeleteOutlineAndroid} from '@vkontakte/icons';
import {Icon16ViewOutline, Icon24ChevronLeft, Icon28ArrowRightSquareOutline} from '@vkontakte/icons';
import TightModel from "../models/TightModel";
import PropTypes from 'prop-types';
import {Icon28Notifications} from '@vkontakte/icons';
import {Icon28ShareOutline} from '@vkontakte/icons';
import {Icon28DoneOutline} from '@vkontakte/icons';
import {Icon24ClockOutline} from '@vkontakte/icons';
import {Carousel} from "react-responsive-carousel";
import Comic from "../components/Comic";
import {Icon20ViewOutline} from '@vkontakte/icons';
import {Icon20LikeOutline} from '@vkontakte/icons';
import {Icon20Like} from '@vkontakte/icons';
import {Icon20HideOutline} from '@vkontakte/icons';
import {Icon28ChevronDownOutline} from '@vkontakte/icons';
import {Icon28ChevronUpOutline} from '@vkontakte/icons';
import TightModal from "../components/TightModal";
import {Icon20Cancel} from '@vkontakte/icons';
import $ from "jquery"
import {Icon28SendOutline} from '@vkontakte/icons';
import Icon16Clear from "@vkontakte/icons/dist/16/clear";
import Icon28SmileOutline from "@vkontakte/icons/dist/28/smile_outline";
import {Icon28Notification} from '@vkontakte/icons';
import User from "../components/User";
import Manga from "../controllers/Manga";
import {Icon28PinDotOutline} from '@vkontakte/icons';
import {Icon28BookmarkOutline} from '@vkontakte/icons';
import Helper from "../components/Helper";
import bridge from "@vkontakte/vk-bridge";

const Tight = ({prop, startReadPlease, setActiveGlav, setActiveTema, tema, setActiveScreen, activeStory, openTight, set_BACK_FROM_TIGHT, setSearch, setActiveStory, BACK_FROM_TIGHT, setProp, bridge, openUser, fetchedUser, MangaController, id, setManga, setActivePanel}) => {
    const [activeTabs, setActiveTabs] = useState("info")
    const HelperD = new Helper();
    const [modal, setModal] = useState("")
    const [popout, setPopout] = useState(null)
    const [activeSort, setActiveSort] = useState("new")
    const [answer, setAnswer] = useState(null);
    const [selectedGlav, setSelectedGlav] = useState(null)
    const [mainComments, setMainComments] = useState(null)
    const [spoiler, setSpoiler] = useState(false)
    const [glavsLikes, setGlavLikes] = useState([])

    const onBack = () => {
        if (BACK_FROM_TIGHT === "reading")
            setActivePanel(BACK_FROM_TIGHT)
        else {
            setActiveStory(BACK_FROM_TIGHT)
        }
    }
    const addLikeToGlav = (id) => {
        let glavLiks = glavsLikes;
        if (!glavLiks.find(e => e.user_id === fetchedUser._id && e.glav_id === id)) {
            glavLiks.push({glav_id: id, manga_id: prop._id, user_id: fetchedUser._id})
        } else {
            let index = glavLiks.findIndex(e => e.user_id === fetchedUser._id && e.glav_id === id)
            glavLiks.splice(index, 1)
        }
        setGlavLikes([...glavLiks])
        MangaController.addLikeToGlav({glava_id: id, manga_id: prop._id}).then((red) => {
            MangaController.getLikesToGlavs({manga_id: red._id}).then((red) => {

                setGlavLikes(red)
            })
        })
    }
    const updateManga = () => {
        MangaController.getUpdate(prop._id).then((r) => {
            setProp(r)
            MangaController.getLikesToGlavs({manga_id: r._id}).then((red) => {
                setGlavLikes(red)
            })
            setComments(r.static_block.all_comments)
        });
    }
    useEffect(() => {

        MangaController.getUpdate(prop._id).then((r) => {
            setProp(r)
            MangaController.getLikesToGlavs({manga_id: r._id}).then((red) => {
                setGlavLikes(red)
            })
            setComments(r.static_block.all_comments)
        });
        setActiveGlav(0)
        setActiveTema(0)
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }, [])
    const setComments = (comments) => {
        let main_comments = comments.filter(e => e.glav_id === null && e.page_id === null);
        if (activeSort === "new") {
            main_comments.sort((a, b) => {
                let fa = new Date(a.when_created),
                    fb = new Date(b.when_created);

                if (fa > fb) {
                    return -1;
                }
                if (fa < fb) {
                    return 1;
                }
                return 0;
            });
        } else {
            main_comments.sort((a, b) => {
                let fa = a.likes.likes,
                    fb = b.likes.likes;

                if (fa > fb) {
                    return -1;
                }
                if (fa < fb) {
                    return 1;
                }
                return 0;
            });
        }
        setMainComments(main_comments)
    }
    const getRatingClass = (d = false) => {


        if (d && prop.hasOwnProperty("static_block")) {
            return parseFloat(prop.static_block.sredRating) >= 8 ? "good_r"
                :
                parseFloat(prop.static_block.sredRating) >= 5 ? "sred_r" : "bad_r"
        } else if (d) {
            return "sred_r";
        }
        if (prop.hasOwnProperty("static_block")) {
            return parseFloat(prop.static_block.sredRating) >= 8 ? "green_rating"
                :
                parseFloat(prop.static_block.sredRating) >= 5 ? "sred_rating" : "red_rating"
        }
        return "sred_rating";
    }
    const inFavorit = (e) => {
        let what = e.currentTarget.dataset.what;//readed or think
        let pr = prop;
        if(!pr.hasOwnProperty("static_block"))
            pr.static_block = {}
        pr.static_block.is_favor = what === "readed" ? 1 : what === "reading" ? 3 : what === "otlj" ? 4 : what === "cross" ? 5 : what === "group" ? 6 : 2;
        setProp({...pr})
        MangaController.addToFavorit({what: pr.static_block.is_favor, manga_id: prop._id}).then((rd) => {
            MangaController.getUpdate(rd._id).then((r) => {

                setProp(r)
            });
        });
    }
    const sendComment = () => {
        let mess = $('#comment_to_tight').val();
        if (mess) {
            MangaController.addComment(
                {
                    manga_id: prop._id,
                    mess: mess,
                    answer: answer,
                    spoiler: spoiler,
                    glav_id: null,
                    page_id: null
                }).then(() => {
                MangaController.getUpdate(prop._id).then((r) => {

                    setProp(r)

                    let k = r.static_block.all_comments;

                    setComments(k)
                });
            })
        }
        $('#comment_to_tight').val("");
    }
    const likeComment = (e) => {

        let like = parseInt(e.currentTarget.dataset.like);
        let comment_id = e.currentTarget.dataset.id;
        MangaController.likeComment({like: like, comment_id: comment_id, manga_id: prop._id}).then((rd) => {

            MangaController.getUpdate(rd._id).then((r) => {
                setProp(r)
                setComments(r.static_block.all_comments)
            });
        })
    }
    const sortComButtons = (e, arr = null) => {
        let type;
        if (e === null)
            type = activeSort;
        else
            type = e.currentTarget.dataset.sort
        let coms = mainComments;
        if (arr !== null) {
            coms = arr;
        }
        setActiveSort(type)

        if (type === "new") {
            coms.sort((a, b) => {
                let fa = new Date(a.when_created),
                    fb = new Date(b.when_created);

                if (fa > fb) {
                    return -1;
                }
                if (fa < fb) {
                    return 1;
                }
                return 0;
            });
        } else {

            coms.sort((a, b) => {
                let fa = a.likes.likes,
                    fb = b.likes.likes;

                if (fa > fb) {
                    return -1;
                }
                if (fa < fb) {
                    return 1;
                }
                return 0;
            });
        }

        if (arr === null)
            setMainComments([...coms])
        else return coms;

    }
    const notifOn = () => {
        MangaController.addNotif({manga_id: prop._id}).then((rd) => {
            MangaController.getUpdate(rd._id).then((r) => {
                setProp(r)
            });
        })
    }
    const openGlav = (key) => {
        MangaController.getRaznicaDate(prop.glavs[key].days_allow).then((res) => {

            if (res.result) {
                startReadPlease(key, prop);
            } else {

                setSelectedGlav({
                    glav: key,
                    time: Helper.getNormalDate(prop.glavs[key].days_allow) === Helper.getNormalDate(new Date()) ? "скоро" : Helper.getNormalDate(prop.glavs[key].days_allow)
                })
                setModal("readerror")
            }
        })
        /*if ( || fetchedUser.vip) {

        } else {


        }*/

    }
    const getTimeWhen = (date) => {
        date = new Date(date)
        var seconds = Math.floor((new Date() - date) / 1000);
        if (seconds >= 10800) {
            return MangaController.getNormalDate(date);
        }
        var interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) + " лет назад";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " месяцев назад";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " дней назад";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " часов назад";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " минут назад";
        }
        if (Math.floor(seconds) <= 0)
            return "только что";
        else
            return Math.floor(seconds) + " секунд назад";


    }
    const getView = (key) => {

        if (prop && prop.hasOwnProperty("static_block") && prop.static_block.views_glavs) {
            if (prop.static_block.views_glavs.glav >= key)
                return (<Icon20ViewOutline width={17} style={{marginRight: 8}} fill={"#735CE6"}/>)
            else
                return (<Icon20HideOutline width={17} style={{marginRight: 8}} fill={"grey"}/>)
        } else {
            return (<Icon20HideOutline width={17} style={{marginRight: 8}} fill={"grey"}/>)
        }
    }
    if (prop)
        return (
            <View popout={popout} activePanel={id}
                  modal={<TightModal updateManga={updateManga} tema={tema} selectedGlav={selectedGlav}
                                     setPopout={setPopout}
                                     MangaController={MangaController} setModal={setModal}
                                     activeModal={modal} prop={prop}/>}>


                <Panel id={id}>
                    <PanelHeader separator={false} shadow={false}
                                 left={
                                     <Icon24ChevronLeft style={{marginLeft: 15}}
                                                        className={Helper.getColorForTheme(tema)}
                                                        onClick={onBack}/>
                                 }>
                    </PanelHeader>
                    <Div className="tight_info">
                        <div className="tight_avatar"
                             style={{backgroundImage: `url(https://foxcomics.ru${prop && prop.avatar && prop.avatar.substring(2).split(' ').join("%20")})`}}/>
                        <Title style={{marginBottom: 15}} className="tight_title nu_Extra_Bold" level={1}
                               weight>{prop && prop.name}</Title>
                        <div className="tight_detailed">
                            <span className={"nu_Bold"}>{prop.year}</span>
                            <span style={{color: "#cdcfd2"}}>|</span>
                            <span className={"nu_Bold"}>{prop.genre && prop.genre[0]}</span>
                            <span style={{color: "#cdcfd2"}}>|</span>
                            <span className={"nu_Bold"}>{prop.age}</span>
                        </div>
                        <div className="tight_detailed2">

                            <div
                                className={`nu_Bold update_rating ${getRatingClass(true)}`}>{prop.static_block && prop.static_block.sredRating}</div>


                            <div style={{alignSelf: "center", justifySelf: "center"}} className="viewv_div">
                                <Icon16ViewOutline style={{marginRight: 5, alignSelf: "center"}}
                                                   className={`${Helper.getColorForTheme(tema)}`}/>
                                <Subhead className={"nu_Semi_Bold articleName"} level="3"
                                         weight="regular">{prop.views ? prop.views : "0"}</Subhead>
                            </div>
                        </div>
                        <div className="tight_buttons">
                            <Button onClick={notifOn} size={"m"} before={
                                prop.static_block &&
                                prop.static_block.hasOwnProperty("notifUser") &&
                                prop.static_block.notifUser ? <Icon28Notification fill={"#937FF5"}/> :
                                    <Icon28Notifications fill={"#937FF5"}/>} mode="tertiary"/>

                            <Button onClick={() => {
                                if (fetchedUser) {
                                    MangaController.add_View(fetchedUser._id, prop._id);
                                    setManga(prop)
                                    setActivePanel("reading")
                                }

                            }}
                                    disabled={!prop.glavs || prop.glavs.length <= 0}
                                    size={"l"}
                                    style={{color: "white"}}
                                    className={`purple_gradient but_non_line nu_Extra_Bold}`}>Перейти
                                к
                                чтению</Button>
                            <Button onClick={() => {
                                bridge.send("VKWebAppShare", {"link": `https://vk.com/app7993934#${Helper.rus_to_latin(prop.name)}-${fetchedUser && fetchedUser._id}`});
                            }} size={"m"} before={<Icon28ShareOutline fill={"#937FF5"}/>} mode="tertiary"/>
                        </div>

                    </Div>
                    <div className="header_tabs" style={{width: "100%"}}>
                        <Tabs style={{width: "100%"}}>
                            <TabsItem
                                onClick={() => setActiveTabs("info")}
                                selected={activeTabs === 'info'}
                            >
                        <span
                            className={`nu_Semi_Bold small ${activeTabs === 'info' ? "purple_gradient_color" : ""}`}>Информация</span>
                            </TabsItem>
                            <TabsItem
                                onClick={() => setActiveTabs("glavs")}
                                selected={activeTabs === 'glavs'}
                            >
                        <span
                            className={`nu_Semi_Bold small ${activeTabs === 'glavs' ? "purple_gradient_color" : ""}`}>Главы</span>
                            </TabsItem>
                            <TabsItem
                                onClick={() => setActiveTabs("comments")}
                                selected={activeTabs === 'comments'}
                            >
                        <span
                            className={`nu_Semi_Bold small ${activeTabs === 'comments' ? "purple_gradient_color" : ""}`}>Комментарии</span>
                            </TabsItem>
                        </Tabs>
                        {activeTabs === 'info' &&
                        <div>
                            <Div>
                                <div style={{marginBottom: 40}}>
                                    <Title style={{marginBottom: 15}} className={"nu_Extra_Bold"} level="2"
                                           weight="regular">Описание</Title>
                                    <Subhead className={"nu_Bold articleName"} level="3"
                                             weight="regular">{prop.description}</Subhead>
                                </div>
                                <div style={{marginBottom: 40}}>
                                    <Title style={{marginBottom: 15}} className={"nu_Extra_Bold"} level="2"
                                           weight="regular">Жанры</Title>
                                    <div className="genre_block">
                                        {prop.genre.map((item, key) => (
                                            <span onClick={() => {
                                                set_BACK_FROM_TIGHT("tight");
                                                setActiveStory("search")
                                                setSearch(item.trim())
                                            }} key={key} className={"genre nu_Bold"}>
                                            {item}
                                        </span>
                                        ))}
                                    </div>
                                </div>
                                {prop.hasOwnProperty("tags") && prop.tags.length > 0 &&

                                <div style={{marginBottom: 40}}>

                                    <Title style={{marginBottom: 15}} className={"nu_Extra_Bold"} level="2"
                                           weight="regular">Теги</Title>
                                    <div className="genre_block tag_block">
                                        {prop.tags.map((item, key) => {
                                            if (item)
                                                return (
                                                    <span onClick={() => {
                                                        setActiveStory("search")
                                                        setSearch(item.trim())
                                                    }} key={key} className={"tag nu_Bold"}>
                                            #{item.trim()}
                                        </span>
                                                )
                                        })}


                                    </div>
                                </div>
                                }

                                {prop.hasOwnProperty("creators") &&
                                <div style={{marginBottom: 40}}>
                                    <Title style={{marginBottom: 15}} className={"nu_Extra_Bold"} level="2"
                                           weight="regular">Над
                                        проектом работали</Title>
                                    <HorizontalScroll>

                                        <div className="people">
                                            {prop.creators && prop.creators.map((item, key) => (
                                                <User onClick={openUser} item={item}/>
                                            ))}
                                        </div>
                                    </HorizontalScroll>
                                </div>
                                }
                                {/* {prop.hasOwnProperty("persons") && prop.persons && prop.persons.length > 0 &&
                            <div style={{marginBottom: 40}}>
                                <Title style={{marginBottom: 15}} className={"nu_Extra_Bold"} level="2"
                                       weight="regular">Главные действующие лица</Title>
                                <HorizontalScroll>

                                    <div className="people">
                                        {prop.persons && prop.persons.map((item, key) => {
                                            if (item.photo && item.name)
                                                return (
                                                    <User avatar={false} onClick={openUser} item={item}/>
                                                )
                                        })}
                                    </div>
                                </HorizontalScroll>
                            </div>
                            }*/}

                                <div style={{marginBottom: 40}}>
                                    <Title style={{marginBottom: 15}} className={"nu_Extra_Bold"} level="2"
                                           weight="regular">Рецензии</Title>
                                    <span className="nu_Bold right_kav">”</span>
                                    <span className="nu_Bold left_kav">“</span>
                                    {prop.static_block && prop.static_block.arts_all && prop.static_block.arts_all.length > 0 &&
                                    <HorizontalScroll>
                                        <div className="people">
                                            {prop.static_block.arts_all.map((item, key) => (
                                                <div className="rez_block">
                                                    <div onClick={() => openUser(item.user)} className="rez_photo">
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
                                                                style={{
                                                                    textAlign: "left",
                                                                    marginTop: 2,
                                                                    marginBottom: 2
                                                                }}
                                                                className={"nu_Semi_Bold articleName"} level="3"
                                                                weight="regular">{item.article}</Subhead>

                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </HorizontalScroll>}
                                    <div className="rez_button">
                                        <Button onClick={() => setModal("article")} size={"l"} mode="outline"
                                                className={" nu_Bold purple_border purple_gradient_color"}>Написать
                                            рецензию</Button>
                                    </div>
                                </div>


                                <div style={{marginBottom: 40}}>
                                    <div className="cards_stats">
                                        <div className="card_stat">
                                            <Title style={{marginBottom: 10}}
                                                   className={"nu_Extra_Bold purple_gradient_color"} level="1"
                                                   weight="regular">{prop.static_block && prop.static_block.arts ? prop.static_block.arts : 0}%</Title>
                                            <Subhead className={"nu_Semi_Bold"} weight="regular"
                                                     style={{color: "#99A2AD", textAlign: "center"}}>положительных
                                                рецензий</Subhead>
                                        </div>
                                        <div className="card_stat">
                                            <Title style={{marginBottom: 10}}
                                                   className={"nu_Extra_Bold purple_gradient_color"} level="1"
                                                   weight="regular">{prop.static_block ? prop.static_block.favorit : 0}</Title>
                                            <Subhead className={"nu_Semi_Bold"} weight="regular"
                                                     style={{color: "#99A2AD", textAlign: "center"}}>добавили в
                                                избранное</Subhead>
                                        </div>
                                        <div className="card_stat">
                                            <Title style={{marginBottom: 10}}
                                                   className={"nu_Extra_Bold purple_gradient_color"} level="1"
                                                   weight="regular">{prop.static_block ? prop.static_block.ratingCount : 0}</Title>
                                            <Subhead className={"nu_Semi_Bold"} weight="regular"
                                                     style={{color: "#99A2AD", textAlign: "center"}}>оценили</Subhead>
                                        </div>
                                        <div className="card_stat">
                                            <Title style={{marginBottom: 10}}
                                                   className={`nu_Extra_Bold ${getRatingClass()}`}
                                                   level="1"
                                                   weight="regular">{prop.static_block ? prop.static_block.sredRating : 0}</Title>
                                            <Subhead className={"nu_Semi_Bold"} weight="regular"
                                                     style={{color: "#99A2AD", textAlign: "center"}}>средняя
                                                оценка</Subhead>
                                        </div>
                                    </div>
                                    <div>
                                        <Button onClick={() => setModal("rating")} stretched size={"l"}
                                                style={{outline: "none", border: 0, marginTop: 15, color: "white"}}
                                                className={`purple_gradient nu_Extra_Bold`}>
                                            Оценить проект
                                        </Button>
                                    </div>
                                </div>

                                <div style={{marginBottom: 40}}>
                                    <Title style={{marginBottom: 15}} className={"nu_Extra_Bold"} level="2"
                                           weight="regular">Добавить в избранное</Title>

                                    <HorizontalScroll>
                                        <div style={{display: 'flex'}}>
                                            <HorizontalCell
                                                disabled={(prop.static_block && prop.static_block.is_favor === 3)}
                                                className={`favor_cell`}>
                                                <Button
                                                    disabled={(prop.static_block && prop.static_block.is_favor === 3)}
                                                    onClick={inFavorit} data-what={"reading"}
                                                    before={<Icon28BookmarkOutline
                                                        fill={prop.static_block ? prop.static_block.is_favor !== 3 ? "white" : "rgb(147,127,245)" : "white"}/>}
                                                    mode="outline"
                                                    className={`favorite_button  ${prop.static_block ? prop.static_block.is_favor !== 3 ? "purple_gradient" : "favorite_button_checked" :"purple_gradient"}`}
                                                    style={prop.static_block && prop.static_block.is_favor !== 3 ? {color: "white"} : {}}
                                                    size={"l"}>Читаю</Button>
                                            </HorizontalCell>
                                            <HorizontalCell
                                                disabled={(prop.static_block && prop.static_block.is_favor === 2)}
                                                className={`favor_cell`}>
                                                <Button
                                                    disabled={(prop.static_block && prop.static_block.is_favor === 2)}
                                                    onClick={inFavorit} data-what={"think"} before={<Icon24ClockOutline
                                                    fill={prop.static_block ? prop.static_block.is_favor !== 2 ? "white" : "rgb(147,127,245)" : "white"}/>}
                                                    mode="outline"
                                                    className={`favorite_button ${prop.static_block ? prop.static_block.is_favor !== 2 ? "purple_gradient" : "favorite_button_checked" : "purple_gradient"}`}
                                                    style={prop.static_block && prop.static_block.is_favor !== 2 ? {color: "white"} : {}}
                                                    size={"l"}>В планах</Button>
                                            </HorizontalCell>
                                            <HorizontalCell
                                                disabled={(prop.static_block && prop.static_block.is_favor === 1)}
                                                className={`favor_cell`}>
                                                <Button
                                                    disabled={(prop.static_block && prop.static_block.is_favor === 1)}
                                                    onClick={inFavorit} data-what={"readed"} before={<Icon28DoneOutline
                                                    fill={prop.static_block ? prop.static_block.is_favor !== 1 ? "white" : "rgb(147,127,245)" : "white"}/>}
                                                    mode="outline"
                                                    className={`favorite_button ${prop.static_block ? prop.static_block.is_favor !== 1 ? "purple_gradient" : "favorite_button_checked" : "purple_gradient"}`}
                                                    style={prop.static_block && prop.static_block.is_favor !== 1 ? {color: "white"} : {}}
                                                    size={"l"}>Прочитано</Button>
                                            </HorizontalCell>
                                            <HorizontalCell
                                                disabled={(prop.static_block && prop.static_block.is_favor === 4)}
                                                className={`favor_cell`}>
                                                <Button
                                                    disabled={(prop.static_block && prop.static_block.is_favor === 4)}
                                                    onClick={inFavorit} data-what={"otlj"} before={<Icon28PinDotOutline
                                                    fill={prop.static_block ? prop.static_block.is_favor !== 4 ? "white" : "rgb(147,127,245)" : "white"}/>}
                                                    mode="outline"
                                                    className={`favorite_button ${prop.static_block ? prop.static_block.is_favor !== 4 ? "purple_gradient" : "favorite_button_checked" : "purple_gradient"}`}
                                                    style={prop.static_block && prop.static_block.is_favor !== 4 ? {color: "white"} : {}}
                                                    size={"l"}>Отложено</Button>
                                            </HorizontalCell>
                                            <HorizontalCell
                                                disabled={(prop.static_block && prop.static_block.is_favor === 5)}
                                                className={`favor_cell`}>
                                                <Button
                                                    disabled={(prop.static_block && prop.static_block.is_favor === 5)}
                                                    onClick={inFavorit} data-what={"cross"}
                                                    before={<Icon28DeleteOutlineAndroid
                                                        fill={prop.static_block ? prop.static_block.is_favor !== 5 ? "white" : "rgb(147,127,245)" : "white"}/>}
                                                    mode="outline"
                                                    className={`favorite_button ${prop.static_block ? prop.static_block.is_favor !== 5 ? "purple_gradient" : "favorite_button_checked":"purple_gradient"}`}
                                                    style={prop.static_block && prop.static_block.is_favor !== 5 ? {color: "white"} : {}}
                                                    size={"l"}>Брошено</Button>
                                            </HorizontalCell>
                                            <HorizontalCell
                                                disabled={(prop.static_block && prop.static_block.is_favor === 6)}
                                                className={`favor_cell`}>
                                                <Button
                                                    disabled={(prop.static_block && prop.static_block.is_favor === 6)}
                                                    onClick={inFavorit} data-what={"group"} before={<Icon28BlockOutline
                                                    fill={prop.static_block ? prop.static_block.is_favor !== 6 ? "white" : "rgb(147,127,245)" : "white"}/>}
                                                    mode="outline"
                                                    className={`favorite_button ${prop.static_block ? prop.static_block.is_favor !== 6 ? "purple_gradient" : "favorite_button_checked" : "purple_gradient"}`}
                                                    style={prop.static_block && prop.static_block.is_favor !== 6 ? {color: "white"} : {}}
                                                    size={"l"}>Без группы</Button>
                                            </HorizontalCell>

                                        </div>
                                    </HorizontalScroll>
                                </div>

                            </Div>
                            {/*   <Group
                            separator={"hide"}
                            style={{padding: 10, paddingTop: 0}}
                            header={
                                <div className={"grp_header"}>
                                    <Title className={"nu_Extra_Bold"} level="1" weight="semibold">Связанные
                                        произведения</Title>
                                </div>

                            }
                        >
                            <Gallery slideWidth="45%" style={{height: 280}}>
                                <div style={{width: 150}}>
                                    <Comic name={"Поднятия уровня в одиночку"} rating={7.1}
                                           img={"https://i.pinimg.com/736x/aa/5e/7d/aa5e7de00ed0c35a0c14622cd7f846fa--young-comic-book.jpg"}/>
                                </div>
                                <div style={{width: 150}}>
                                    <Comic name={"Поднятия уровня в одиночку"} rating={6.3}
                                           img={"https://i.pinimg.com/originals/ad/37/31/ad373147c83d92264d68d2052a1073cd.jpg"}/>
                                </div>
                                <div style={{width: 150}}>
                                    <Comic name={"Поднятия уровня в одиночку"} rating={4.2}
                                           img={"https://i.pinimg.com/originals/ad/37/31/ad373147c83d92264d68d2052a1073cd.jpg"}/>
                                </div>
                            </Gallery>
                        </Group>*/}
                            {prop.hasOwnProperty("pohojie_mangas") && prop.pohojie_mangas.length > 0 &&
                            <Group
                                separator={"hide"}
                                style={{padding: 10, paddingTop: 0}}
                                header={
                                    <div className={"grp_header"}>
                                        <Title className={"nu_Extra_Bold"} level="1" weight="semibold">Похожие
                                            произведения</Title>

                                    </div>

                                }
                            >
                                <Gallery slideWidth="45%" style={{height: 280}}>
                                    {prop.pohojie_mangas.map((item, key) => (
                                        <div style={{width: 150}}>
                                            <Comic name={item.name} onClick={() => {
                                                set_BACK_FROM_TIGHT("main");
                                                openTight(item)
                                            }} key={key} rating={item.sredRating}
                                                   img={item.avatar && `https://foxcomics.ru${item.avatar.substring(2).split(' ').join("%20")}`}/>
                                        </div>
                                    ))}
                                </Gallery>
                            </Group>
                            }

                        </div>
                        }
                        {activeTabs === "glavs" &&
                        <div className="tight_glavs">

                            {prop && prop.glavs.map((item, key) => {
                                let rnd
                                if(!prop.hasOwnProperty("text"))
                                rnd = Math.floor(Math.random() * prop.glavs[key].series.length)
                                return(
                                    <div key={key} className="glava_block">
                                        <CellButton className="glava_block adsadqwe" onClick={() => openGlav(key)}>
                                            <div className="row_glava">
                                                {getView(key)}

                                                <div className="tight_avatar modal_avatar cc1 " style={{
                                                    marginRight: 10,
                                                    width: 70,
                                                    height: 70,
                                                    backgroundImage: `${prop.hasOwnProperty("text") ?
                                                    `url(https://foxcomics.ru${prop && prop.avatar && prop.avatar.substring(2).split(' ').join("%20")})`
                                                        :
                                                        `url('https://foxcomics.ru${prop.glavs[key].hasOwnProperty("path") ? prop.glavs[key].path : item.path}/photos/${prop.glavs[key].series[rnd]}')`
                                                }`
                                                }}/>

                                            </div>
                                            <div className="glav_info">
                                                <Title style={{padding: 0, color: "#735CE6"}}
                                                       className="tight_title this_is_title nu_Bold d24"
                                                       level={3}
                                                       weight>{item.name}</Title>
                                                <Subhead className={"nu_Semi_Bold d23"} weight="regular"
                                                         style={{color: "#99A2AD"}}>{item.when_created && Helper.getNormalDate(item.when_created)}</Subhead>
                                                {/*{!MangaController.getRaznicaDate(item.days_allow) &&
                                    <Subhead className={"nu_Semi_Bold d23"} weight="regular"
                                             style={{color: "#99A2AD"}}>
                                        <span style={{color:"red"}}>Доступно только для VIP.</span><br/><span style={{color:"green"}}>Доступно всем будет {Helper.getNormalDate(item.days_allow)}</span>
                                    </Subhead>
                                    }*/}

                                            </div>
                                        </CellButton>

                                        {(MangaController.getRaznicaDateOffline(item.days_allow) || fetchedUser.vip) ?
                                            <IconButton onClick={() => addLikeToGlav(key)} className={"glav_likes"}>
                                                {/*Icon20LikeOutline*/}
                                                {fetchedUser && glavsLikes.length > 0 && glavsLikes.find(e => e.user_id === fetchedUser._id && e.glav_id === key) ?
                                                    <Icon20Like width={17} fill={"#735CE6"}/> :
                                                    <Icon20LikeOutline width={17} fill={"#735CE6"}/>
                                                }

                                                <Subhead className={"nu_Semi_Bold"} weight="regular"
                                                         style={{color: "#735CE6"}}>{
                                                    glavsLikes.length > 0 ? glavsLikes.filter(e => e.glav_id === key).length : 0
                                                }</Subhead>
                                                {/*#99A2AD*/}
                                            </IconButton> :
                                            <Icon20LockOutline fill={"grey"}/>
                                        }
                                    </div>
                                )
                            })}

                        </div>
                        }
                        {activeTabs === "comments" &&
                        <div className="tight_comments">
                            <div className="tight_comments_buttons">
                                <Button onClick={sortComButtons} data-sort={"new"}
                                        style={activeSort === "new" ? {marginRight: 10, color: "white"} : {
                                            color: "#99A2AD",
                                            marginRight: 10
                                        }} size={"s"}
                                        mode={activeSort === "new" ? `` : "tertiary"}
                                        className={`${activeSort === "new" ? "purple_gradient" : ""} noBorder nu_Regular`}>Новое</Button>
                                <Button onClick={sortComButtons} data-sort={"pop"} size={"s"}
                                        style={activeSort === "pop" ? {color: "white"} : {color: "#99A2AD"}}
                                        className={`${activeSort === "pop" ? "purple_gradient" : ""} nu_Regular`}
                                        mode={activeSort === "new" ? `tertiary` : ""}>Популярное</Button>
                            </div>
                            {mainComments && mainComments.map((item, key) => (
                                <div className="comment">
                                    <div className="comment_info">
                                        <div
                                            className={`avatarBorder ${item.user && item.user.hasOwnProperty("avatar_border") ?
                                                HelperD.getNameOfBorder(item.user.avatar_border) : HelperD.getNameOfBorder(0)}`}>
                                            <Avatar onClick={() => openUser(item.user)} style={{marginRight: 10}}
                                                    size={48}
                                                    className={"avatar_people"}
                                                    src={item.user.photo_100}/>
                                        </div>
                                        <div className="comment_name">
                                            <Title className="tight_title nu_Bold d11" level={3}
                                            >{item.user.name}</Title>
                                            <Subhead className="nu_Semi_Bold" weight="regular"
                                                     style={{color: "#99A2AD"}}>{getTimeWhen(item.when_created)}</Subhead>
                                        </div>

                                    </div>
                                    <div onClick={() => {
                                        let commnetse = mainComments;
                                        mainComments[key].spoiler = !mainComments[key].spoiler;
                                        setMainComments([...commnetse])

                                    }} className={`comment_text spoiler_${item.spoiler}`}>
                                        <div className="blur_me">
                                            <Title className="tight_title nu_Semi_Bold d11"
                                                   level={3}>{item.mess}</Title>
                                        </div>
                                        {item.spoiler &&
                                        <div className="spoiler_text nu_Semi_Bold">
                                            Осторожно, спойлер!
                                        </div>
                                        }
                                    </div>

                                    <div className="comment_buttons">

                                        <Button onClick={() => {
                                            setAnswer(item)
                                            /* $('html, body').animate({
                                                 scrollTop: $("#comment_to_tight").offset().top
                                             }, 500);*/
                                            $("html, body").animate({scrollTop: $(document).height()}, 500);
                                        }} mode="tertiary"
                                                className={"purple_gradient_color nu_Semi_Bold"}>Ответить</Button>
                                        <div className="comment_buttons_rating">

                                            <Button onClick={likeComment} data-like={-1} data-id={item._id}
                                                    mode="tertiary"
                                                    before={<Icon28ChevronDownOutline className={"but_rating_icon"}
                                                                                      fill={item.likes.yor_like !== null && item.likes.yor_like.like === -1 ? "red" : "#99A2AD"}/>}/>
                                            <Subhead
                                                style={{color: item.likes.yor_like !== null ? item.likes.yor_like.like === 1 ? "green" : "red" : "grey"}}
                                                className="tight_title nu_Semi_Bold" level={3}
                                            >{item.likes.likes}</Subhead>
                                            <Button onClick={likeComment} data-like={1} data-id={item._id}
                                                    mode="tertiary"
                                                    before={<Icon28ChevronUpOutline className={"but_rating_icon"}
                                                                                    fill={item.likes.yor_like !== null && item.likes.yor_like.like === 1 ? "green" : "#99A2AD"}/>}/>
                                        </div>
                                    </div>
                                    {item.answers &&
                                    <div className="answers_cc">
                                        {item.answers.map((itemd, keyd) => (
                                            <div key={keyd} className="answer">
                                                <div className="answer_line"/>
                                                <div className="comment">
                                                    <div className="comment_info">
                                                        <div
                                                            className={`avatarBorder ${itemd.user && itemd.user.hasOwnProperty("avatar_border") ?
                                                                HelperD.getNameOfBorder(itemd.user.avatar_border) : HelperD.getNameOfBorder(0)}`}>
                                                            <Avatar onClick={() => openUser(itemd.user)}
                                                                    style={{marginRight: 10}} size={48}
                                                                    className={"avatar_people"}
                                                                    src={itemd.user.photo_100}/>
                                                        </div>
                                                        <div className="comment_name">
                                                            <Title className="tight_title nu_Bold d11" level={3}
                                                            >{itemd.user.name}</Title>
                                                            <Subhead className="nu_Semi_Bold" weight="regular"
                                                                     style={{color: "#99A2AD"}}>{getTimeWhen(itemd.when_created)}</Subhead>
                                                        </div>

                                                    </div>
                                                    <div onClick={() => {
                                                        let commnetse = mainComments;
                                                        mainComments[key].spoiler = !mainComments[key].spoiler;
                                                        setMainComments([...commnetse])

                                                    }} className={`comment_text spoiler_${item.spoiler}`}>
                                                        <div className="blur_me">
                                                            <Title className="tight_title nu_Semi_Bold d11"
                                                                   level={3}>{itemd.mess}</Title>
                                                        </div>

                                                    </div>

                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    }
                                </div>
                            ))}


                            <Group style={{marginTop: 50, padding: 0}}>
                                {spoiler &&
                                <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                                    <span className="nu_Semi_Bold"
                                          style={{textAlign: "center", color: "red", fontSize: 12}}>Комментарий помечен как - спойлер</span>
                                </div>

                                }
                                {answer &&
                                <div className="answer_to_to">
                                <span className="nu_Semi_Bold"
                                      style={{color: "grey"}}>Ответ {answer.user.name.split(" ")[0]}</span>
                                    <IconButton onClick={() => setAnswer(null)} children={<Icon20Cancel
                                        fill={"#735CE6"}/>}/>
                                </div>
                                }


                                <WriteBar
                                    className={"write_bar_bar_bar"}
                                    id={"comment_to_tight"}
                                    before={
                                        <WriteBarIcon onClick={() => setSpoiler(prevState => !prevState)}>
                                            {spoiler ?
                                                <Icon28HideOutline fill={"#735CE6"}/> :
                                                <Icon28ViewOutline fill={"grey"}/>
                                            }
                                        </WriteBarIcon>
                                    }
                                    after={
                                        <Fragment>
                                            <WriteBarIcon
                                                mode="send"
                                                disabled={false}
                                                onClick={sendComment}
                                            />
                                        </Fragment>
                                    }
                                    placeholder="Написать комментарий..."
                                />
                            </Group>

                        </div>
                        }


                    </div>
                </Panel>
            </View>
        )
    else
        return (
            <View popout={popout} activePanel={id}
               >
            </View>
        )
}

Tight.propTypes = {
    prop: PropTypes.instanceOf(TightModel)
};

export default Tight;