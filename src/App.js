import React, {useState, useEffect, useRef} from 'react';
import bridge from '@vkontakte/vk-bridge';
import bannedImg from "./img/ban1.png"
import bannedImg2 from "./img/ban2.png"
import bannedImg3 from "./img/ban3.png"
import bannedImg4 from "./img/ban4.jpg"
import {
    View, ScreenSpinner, AdaptivityProvider, AppRoot,
    Tabbar, Epic, TabbarItem, Panel, PanelHeader, Group, Placeholder, PanelHeaderBack, ConfigProvider, Title, Div
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {

    Icon56NewsfeedOutline, Icon28NewsfeedOutline, Icon28ServicesOutline, Icon28MessageOutline,
    Icon28ClipOutline,
    Icon28UserCircleOutline,
    Icon28FavoriteOutline,
    Icon28Notifications,
    Icon28ListOutline,
    Icon28SettingsOutline
} from "@vkontakte/icons"
import queryString from 'query-string';

const parsed = queryString.parse(window.location.search);
const vk_id = parseInt(parsed.vk_user_id);
let urrrl = null
let startManga = null
if (window.location.href.split("#").length > 1) {
    urrrl = window.location.href.split("#")[1];
    if (urrrl.indexOf("-") !== -1) {
        startManga = urrrl.split("-")[0];
        urrrl = urrrl.split("-")[1];
    }
}
const favorite_is = parseInt(parsed.vk_is_favorite);


import Main from "./panels/Main";
import Favorite from "./panels/Favorite";
import Notifications from "./panels/Notifications";
import Rating from "./panels/Rating";
import Settings from "./panels/Settings";
import Tight from "./panels/Tight";
import Customize from "./panels/Customize";
import Rules from "./panels/Rules";
import User from "./controllers/User"
import PropTypes from "prop-types";
import TightModel from "./models/TightModel";
import {Icon28UsersCircleFillYellow} from '@vkontakte/icons';
import Admin from "./panels/Admin";
import Comics from "./controllers/Comics";
import Reading from "./panels/Reading";
import UserModal from "./components/UserModal";
import Search from "./panels/Search";
import Helper from "./components/Helper";
//#937FF5
const App = ({UserController, NewsController, ComicsController, MangaController}) => {
    let banImages = [
        bannedImg,
        bannedImg2,
        bannedImg3,
        bannedImg4,
    ]
    const [banImg, setBanImg] = useState(0)
    const banImgRef = useRef();
    banImgRef.current = banImg;
    const [search, setSearch] = useState("");
    const [theme, setThemeD] = useState("bright_light")
    const [BACK_FROM_TIGHT, set_BACK_FROM_TIGHT] = useState("main");
    const [admin, setAdmin] = useState(false);
    const [activePanel, setActivePanel] = useState('home');
    const activePanelRef = useRef();
    activePanelRef.current = activePanel;
    const [fetchedUser, setUser] = useState(null);
    const [manga, setManga] = useState(null);
    const [popout, setPopout] = useState(<ScreenSpinner size='large'/>);
    const [activeStory, setActiveStory] = useState("main")
    const [tightItem, setTightItem] = useState(null);
    const [comicsNezavis, setComicsNezavis] = useState(null)
    const [comicsFox, setComicsFox] = useState(null)
    const [comicsBooks, setComicsBooks] = useState(null)
    const [activeModal, setActiveModal] = useState(null)
    const [alerts, setAlerts] = useState(null)
    const [user, setModalUser] = useState(null)
    const [label, setLabel] = useState(null)
    const [activeGlav, setActiveGlav] = useState(0)
    const [activeTema, setActiveTema] = useState(0);
    const [musicBlock, setMusicBlock] = useState(null)
    const [banned, setBanned] = useState(false)
    const musicBlockRef = useRef();
    musicBlockRef.current = musicBlock;
    let TightItem = {
        avatar: "https://metruyentranh.com/images/covers/death-note.jpg",
        name: "Тетрадь смерти ваншот",
        description: "Тетрадь смерти — манга за авторством Цугуми Обы, проиллюстрированная Такэси Обатой, выпускавшаяся в журнале Weekly Shonen Jump с 1 декабря 2003 года. Согласно опросу, проведённому в 2007 году министерством культуры Японии, занимает 10-е место среди лучшей манги.",
        year: "2021",
        genre: "Комедия",
        age: "18+",
        rating: 8.9,
        views: 143
    }

    useEffect(() => {

        setInterval(() => {
            if (activePanelRef.current && musicBlockRef.current && activePanelRef.current !== "reading") {
                try {

                    musicBlockRef.current.pause();
                    setMusicBlock(null)
                } catch (e) {

                }

            }
        }, 1000)
        bridge.subscribe(({detail: {type, data}}) => {
            if (type === 'VKWebAppUpdateConfig') {
                const schemeAttribute = document.createAttribute('scheme');
                // schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
                // document.body.attributes.setNamedItem(schemeAttribute);
            }
            if (type === `‘VKWebAppShowOrderBoxResult’`) {
            }
        });
        /*bridge.send("VKWebAppStorageSet", {"key": "reading_tooltip", "value":'0'});*/
        async function fetchData() {
            try {

                let b = await UserController.checkD();
                if (b.ch_ === false) {
                    setPopout(null)
                    setBanned(true)
                    return false;
                }
                let scheme = await bridge.send("VKWebAppStorageGet", {"keys": ["theme"]});

                if (scheme && scheme.keys.length > 0) {
                    setThemeD(scheme.keys[0].value)
                } else {
                    setThemeD("bright_light")
                }

                const user = await bridge.send('VKWebAppGetUserInfo');
                user.invite = parseInt(urrrl ? urrrl : 0);
                let serverResponse = await UserController.findProfile(user)
                ComicsController.getComics().then((c) => {
                    setComicsNezavis(c.nezav)
                    setComicsBooks(c.books)
                    setComicsFox(c.fox)
                });
                UserController.is_admin(user.id).then((res) => {
                    setAdmin(res)
                })
                MangaController.userId = serverResponse._id;
                MangaController.getAlerts({}).then((r) => {
                    setAlerts(r)
                })
                NewsController.userId = serverResponse._id;
                UserController.userId = serverResponse._id;
                setUser(serverResponse);

                if (startManga !== null && startManga) {

                    MangaController.getManga({manga_name: Helper.latin_to_rus(startManga)}).then((r) => {

                        if (r) {
                            setPopout(null);
                            openTight(r)
                        }
                    })
                } else {
                    setPopout(null);
                }

            } catch (e) {
                setPopout(null)

                setBanned(true)
            }

        }

        fetchData();

    }, []);
    const updateLists = () => {
        ComicsController.getComics().then((c) => {
            setComicsNezavis(c.nezav)
            setComicsBooks(c.books)
            setComicsFox(c.fox)
        });
    }
    const go = e => {
        setActiveStory(e.currentTarget.dataset.to);
    };
    const onStoryChange = (e) => {
        let to = e.currentTarget.dataset.story;
        setActiveStory(to)
    }
    const openTight = (item) => {
        setManga(item)
        if (activePanel !== "home")
            setActivePanel("home")
        if (activeStory === "tight") {
            setActiveStory("main")
            setTimeout(() => {
                setActiveStory("tight")
            }, 200)

        } else {
            setActiveStory("tight")
        }

    }
    const openUser = (s, person = false) => {
        setPopout(<ScreenSpinner size='large'/>)
        if (person)
            s.person = true;
        setModalUser(s)
        setActiveModal("user_rating")
    }
    const setTheme = (theme_v) => {
        bridge.send("VKWebAppStorageSet", {"key": "theme", "value": theme_v});
        setThemeD(theme_v)
    }
    useEffect(() => {
        if (alerts && alerts.length > 0) {
            let d = alerts;
            let rt = null;
            d.filter(el => el.readed === false).length === 0 ?
                setLabel(null) :
                setLabel(d.filter(el => el.readed === false).length)
            return rt;

        } else setLabel(null);
    }, [alerts])
    const updatedata = () => {
        UserController.findProfile(fetchedUser).then((r) => {
            setUser(r)
        })
    }
    const startReadPlease = (glavid, prop, seria = null) => {

        if (seria !== null) {

            setActiveGlav(seria)
            setActiveTema(glavid)
            MangaController.getUpdate(prop._id).then((r) => {
                console.log("OKEY",r)
                setManga(r)
                MangaController.add_View(fetchedUser._id, prop._id);
                setActivePanel("reading")
                setActiveStory("tight")
            });
        } else {
            setActiveGlav(0)
            setActiveTema(glavid)
            MangaController.add_View(fetchedUser._id, prop._id);
            setManga(prop)
            setActivePanel("reading")
        }
    }
    useEffect(() => {
        const interval = setInterval(() => {
            if (banImgRef.current < 3)
                setBanImg(prevState => prevState + 1)
            else if (banImgRef.current <= 3) {
                setTimeout(() => {
                    setBanImg(prevState => prevState + 1)

                }, 3000)
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        if (banImg === 4) {
            if (banned)
                bridge.send("VKWebAppShowNativeAds", {ad_format: "reward"});
        }
    }, [banImg])
    if (!banned)
        return (
            <ConfigProvider scheme={theme}>
                <AdaptivityProvider>
                    <AppRoot>
                        <View modal={<UserModal tema={theme} activePanel={activePanel} activeStory={activeStory}
                                                openTight={openTight}
                                                set_BACK_FROM_TIGHT={set_BACK_FROM_TIGHT} setUser={setModalUser}
                                                UserController={UserController}
                                                setPop={setPopout} setActiveModal={setActiveModal} user={user}
                                                activeModal={activeModal}/>}
                              activePanel={activePanel} popout={popout}>
                            <Panel id={"home"}>
                                <Epic activeStory={activeStory} tabbar={
                                    <Tabbar>
                                        <TabbarItem
                                            onClick={onStoryChange}
                                            selected={activeStory === 'main'}
                                            data-story="main"
                                            text="Главная"
                                        ><Icon28NewsfeedOutline/></TabbarItem>
                                        <TabbarItem
                                            onClick={onStoryChange}
                                            selected={activeStory === 'favor'}
                                            data-story="favor"
                                            text="Избранное"
                                        ><Icon28FavoriteOutline/></TabbarItem>
                                        <TabbarItem
                                            onClick={onStoryChange}
                                            selected={activeStory === 'notif'}
                                            data-story="notif"
                                            label={label}
                                            text="Уведомления"
                                        ><Icon28Notifications/></TabbarItem>
                                        <TabbarItem
                                            onClick={onStoryChange}
                                            selected={activeStory === 'rating'}
                                            data-story="rating"
                                            text="Рейтинг"
                                        ><Icon28ListOutline/></TabbarItem>
                                        <TabbarItem
                                            onClick={onStoryChange}
                                            selected={activeStory === 'settings'}
                                            data-story="settings"
                                            text="Настройки"
                                        ><Icon28SettingsOutline/></TabbarItem>
                                        {admin && admin.admin &&
                                        <TabbarItem
                                            onClick={onStoryChange}
                                            selected={activeStory === 'admin'}
                                            data-story="admin"
                                            text="Админка"
                                        ><Icon28UsersCircleFillYellow/></TabbarItem>
                                        }

                                    </Tabbar>
                                }>
                                    <Main updateLists={updateLists} tema={theme} startReadPlease={startReadPlease}
                                          fetchedUser={fetchedUser} openUser={openUser} NewsController={NewsController}
                                          setActiveStory={setActiveStory} MangaController={MangaController}
                                          booksComics={comicsBooks} foxComics={comicsFox}
                                          BACK_FROM_TIGHT={BACK_FROM_TIGHT}
                                          set_BACK_FROM_TIGHT={set_BACK_FROM_TIGHT} openTight={openTight}
                                          comicsNezavis={comicsNezavis} id={"main"}/>
                                    <Favorite setActiveStory={setActiveStory} set_BACK_FROM_TIGHT={set_BACK_FROM_TIGHT}
                                              BACK_FROM_TIGHT={BACK_FROM_TIGHT} openTight={openTight}
                                              UserController={UserController} id={"favor"}/>
                                    <Notifications UserController={UserController} bridge={bridge}
                                                   fetchedUser={fetchedUser} setAlerts={setAlerts}
                                                   MangaController={MangaController}
                                                   set_BACK_FROM_TIGHT={set_BACK_FROM_TIGHT} openTight={openTight}
                                                   alerts={alerts} setActiveStory={setActiveStory} id={"notif"}/>
                                    <Rating tema={theme} openUser={openUser} bridge={bridge}
                                            UserController={UserController}
                                            id={"rating"}/>
                                    <Settings setUser={setUser} UserController={UserController}
                                              setActiveStory={setActiveStory} favorite_is={favorite_is} theme={theme}
                                              bridge={bridge} go={go} fetchedUser={fetchedUser} id={"settings"}/>
                                    <Tight setActiveTema={setActiveTema} setActiveGlav={setActiveGlav} tema={theme}
                                           startReadPlease={startReadPlease} set_BACK_FROM_TIGHT={set_BACK_FROM_TIGHT}
                                           openTight={openTight}
                                           activeStory={activeStory} setSearch={setSearch}
                                           setActiveScreen={setActivePanel}
                                           BACK_FROM_TIGHT={BACK_FROM_TIGHT} openUser={openUser} bridge={bridge}
                                           setProp={setManga} fetchedUser={fetchedUser}
                                           MangaController={MangaController} setActivePanel={setActivePanel}
                                           setManga={setManga} setActiveStory={setActiveStory} prop={manga}
                                           id={"tight"}/>
                                    <Customize bridge={bridge} updateUser={updatedata} fetchedUser={fetchedUser}
                                               UserController={UserController} setUser={setUser}
                                               tema={theme} setTheme={setTheme} go={go} id={"customize"}/>
                                    <Rules tdema={theme} go={go} id={"rules"}/>
                                    <Admin admin={admin} NewsController={NewsController}
                                           MangasController={MangaController}
                                           UserController={UserController} id={"admin"}/>
                                    <Search tema={theme} BACK_FROM_TIGHT={BACK_FROM_TIGHT}
                                            setActiveStory={setActiveStory} setActivePanel={setActivePanel}
                                            search={search} setSearch={setSearch}
                                            set_BACK_FROM_TIGHT={set_BACK_FROM_TIGHT}
                                            openTight={openTight} MangaController={MangaController} id={"search"}/>
                                </Epic>
                            </Panel>
                            <Reading musicBlock={musicBlock} setMusicBlock={setMusicBlock} tema={theme}
                                     activeTema={activeTema} activeGlav={activeGlav} setActiveGlav={setActiveGlav}
                                     setActiveTema={setActiveTema} fetchedUser={fetchedUser} bridge={bridge}
                                     openUser={openUser}
                                     MangaController={MangaController} setProp={setManga} prop={manga} id={"reading"}
                                     setActivePanel={setActivePanel}/>
                        </View>

                    </AppRoot>
                </AdaptivityProvider>
            </ConfigProvider>
        );
    else return (
        <ConfigProvider scheme={theme}>
            <AdaptivityProvider>
                <AppRoot>
                    <View
                        activePanel={"banned"} popout={popout}>
                        <Panel style={{overflow: "hidden"}} id={"banned"}>
                            <Div className="banned_div">
                                <Title className={"nu_Regular articleName"} level="2" weight="regular">
                                    Упс, кажется вы в бане...
                                </Title>
                                <img className={"banned_img"} src={banImages[banImg > 3 ? 3 : banImg]}/>
                            </Div>

                        </Panel>
                    </View>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    )
}
App.propTypes = {
    UserController: PropTypes.instanceOf(User),
    ComicsController: PropTypes.instanceOf(Comics)
};
export default App;
