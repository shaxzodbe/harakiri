import {
    Panel,
    PanelHeader,
    View,
    ActionSheet,
    ActionSheetItem,
    PanelHeaderContext,
    List,
    Cell,
    Tabs,
    TabsItem,
    ScreenSpinner,
    Div, IOS,
    Title,
    Spinner,
    Touch,
    Subhead,
    HorizontalScroll,
    Button,
    Avatar,
    Badge, usePlatform,
    Counter,
    Header,
    Group, IconButton, WriteBar, WriteBarIcon, Progress, HorizontalCell, Alert, Placeholder, Tooltip
} from "@vkontakte/vkui";
import {ColorPicker, useColor} from "react-color-palette";
import React, {useState, useEffect, useCallback, useRef, Fragment} from "react"
import parse from "html-react-parser"
import {
    Icon20LikeOutline, Icon28BlockOutline,
    Icon28BookmarkOutline,
    Icon28DeleteOutlineAndroid, Icon28HideOutline,
    Icon28PinDotOutline, Icon28ViewOutline
} from '@vkontakte/icons';
import {
    Icon24ChevronLeft,
    Icon28UsersOutline,
    Icon24Done,
    Icon28SettingsOutline,
    Icon16Dropdown,
    Icon20Like,
    Icon28DoneOutline,
    Icon24ClockOutline,
    Icon28ChevronDownOutline,
    Icon28ChevronUpOutline,
    Icon20Cancel
} from "@vkontakte/icons";
import {Icon28CheckCircleOn} from '@vkontakte/icons';
import $ from "jquery";
import {Icon28CommentOutline} from '@vkontakte/icons';
import Api from "../controllers/Api";
import {Icon28Chevrons2LeftOutline} from '@vkontakte/icons';
import {Icon28VolumeOutline} from '@vkontakte/icons';
import {Icon28MuteOutline} from '@vkontakte/icons';
import {Icon56FragmentsOutline} from '@vkontakte/icons';
import {Icon28BillSeparatedOutline} from '@vkontakte/icons';
import ReadingSettings from "../components/ReadingSettings";
import User from "../components/User";
import Helper from "../components/Helper";
import {Icon28Play} from '@vkontakte/icons';
import {useSpeechSynthesis} from 'react-speech-kit';
import bridge from "@vkontakte/vk-bridge";
import {LazyLoadImage} from "react-lazy-load-image-component";

const Reading = ({id, tema, setActivePanel, musicBlock, bridge, setMusicBlock, activeGlav, setActiveGlav, activeTema, setActiveTema, fetchedUser, setProp, openUser, MangaController, prop}) => {
    const [pageX, setPageX] = useState(2);
    const platform = usePlatform();
    const [showMenu, setShowMenu] = useState(false);
    const [popout, setPop] = useState(null)
    const [openMenu, setOpenMenu] = useState(null)
    const [activeModal, setActiveModal] = useState(null)
    const HelperD = new Helper();
    const [comments, setComments] = useState(null);

    const [activeSort, setActiveSort] = useState("new")

    const [scrollMode, setScrollMode] = useState(true);
    const musicRef = useRef();
    musicRef.current = musicBlock;
    const scrollRef = useRef();
    scrollRef.current = scrollMode
    const glavRef = useRef();
    glavRef.current = activeGlav;

    const [fontSize, setFontSize] = useState(14);
    const [font, setFont] = useState('Nunito');
    const [color, setColor] = useColor("hex", "#121212");
    const [backgroundColor, setBackground] = useColor("hex", "#fff");
    const [answer, setAnswer] = useState(null)
    const [selectedGlav, setSelectedGlav] = useState(null)
    //const ApiController = new Api();
    const [openedGlav, setOpenedGlav] = useState(0)
    const [music, setMusic] = useState(false);
    const [oldData, setOldData] = useState({glav: null, serias: null})
    const [spoiler, setSpoiler] = useState(false)
    const [tooltip, setTooltip] = useState(false)
    const [value, setValue] = useState('');

    const [speech, setSpeech] = useState(false)

    const likeComment = (e) => {
        let like = parseInt(e.currentTarget.dataset.like);
        let comment_id = e.currentTarget.dataset.id;
        MangaController.likeComment({like: like, comment_id: comment_id, manga_id: prop._id}).then((rd) => {
            MangaController.getCommentsfForRead({manga_id: prop._id}).then((r) => {
                sortComments(r.comments)
            })
        })
    }

    let allow_detec = true;


    const handleScroll = useCallback(() => {

        if (allow_detec) {
            let text = prop.hasOwnProperty("text") ? prop.text : false;
            if (!text) {
                let imgs = $(".scroll_img");

                for (let i = 0; i < imgs.length; i++) {
                    let y = imgs[i].getBoundingClientRect().y;

                    if (imgs[0].getBoundingClientRect().y === 56) {
                        setActiveGlav(0)
                    } else if (y - (window.outerHeight / 3) < window.outerHeight && y > -100) {
                        let glava = $(imgs[i]).data("glav")
                        if (activeGlav !== parseInt(glava)) {
                            if (isNaN(parseInt(glava)))
                                setActiveGlav(0)
                            else
                                setActiveGlav(parseInt(glava))
                        }

                    }
                }
            } else {
                let imgs = $(".scroll_img");
                let center = (window.innerHeight / 2) - 150;
                if (imgs && imgs.length > 1) {

                    for (let i = 0; i < imgs.length; i++) {
                        let y = imgs[i].getBoundingClientRect().y;
                        if (center > y && y < 50) {
                            let glava = $(imgs[i]).data("glav")
                            if (activeGlav !== parseInt(glava)) {

                                setActiveGlav(parseInt(glava))
                            }

                        }
                    }
                }
            }
        }
    }, []);

    useEffect(() => {
        $("body").scroll(handleScroll);
    }, []);

    const sortComments = (comnt) => {
        let arr = [];
        for (let i = 0; i < prop.glavs.length; i++) {
            if (!prop.hasOwnProperty("text")) {
                let pages = prop.glavs[i].series;
                let pageCom = [];
                for (let j = 0; j < pages.length; j++) {
                    let thisCom = comnt.filter(e => e.glav_id === i && e.page_id === j);
                    if (thisCom.length > 0)
                        thisCom.sort((a, b) => {
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
                    pageCom.push(thisCom);
                }
                arr.push(pageCom)
            } else {
                let thisCom = comnt.filter(e => e.glav_id === i);
                if (thisCom.length > 0)
                    thisCom.sort((a, b) => {
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
                arr.push(thisCom);
            }

        }
        arr = sortComButtons(null, arr)
        setComments(arr)
    }
    let loadedImages = [];

    function hexToRGB(h) {
        let r = 0, g = 0, b = 0;

        // 3 digits
        if (h.length == 4) {
            r = "0x" + h[1] + h[1];
            g = "0x" + h[2] + h[2];
            b = "0x" + h[3] + h[3];

            // 6 digits
        } else if (h.length == 7) {
            r = "0x" + h[1] + h[2];
            g = "0x" + h[3] + h[4];
            b = "0x" + h[5] + h[6];
        }

        return {r: r, g: g, b: b, a: undefined};
    }

    function hexToHSL(hex) {

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result)
            return false;
        let r = parseInt(result[1], 16);
        let g = parseInt(result[2], 16);
        let b = parseInt(result[3], 16);
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        let HSL = {};
        HSL['h'] = h;
        HSL['s'] = s;
        HSL['v'] = l;
        HSL['a'] = undefined;
        return HSL;
    }

    useEffect(() => {
        if (prop && prop.hasOwnProperty("text")) {
            bridge.send("VKWebAppStorageGet", {"keys": ["font", "background_color", "color", "font_size"]}).then((r) => {
                if (r.keys) {
                    r.keys.forEach((item) => {
                        if (item.key === "font") {
                            setFont(item.value)
                        }
                        if (item.key === "background_color") {
                            setBackground({hex: item.value, rgb: hexToRGB(item.value), hsv: hexToHSL(item.value)})
                        }
                        if (item.key === "color") {
                            setColor({hex: item.value, rgb: hexToRGB(item.value), hsv: hexToHSL(item.value)})
                        }
                        if (item.key === "font_size") {
                            setFontSize(parseInt(item.value))
                        }
                    })
                }
            });
        }
        /*if (prop) {
            let merged = [].concat.apply([], prop.glavs);//РЕДАКТИРОВАТЬ
            for (let j = 0; j < merged[0].series.length; j++) {
                let newImg = new Image;
                newImg.onload = function () {
                    loadedImages.push(this.src)

                }
                newImg.src = "https://foxcomics.ru/mangas/1634564543глава%201%20готово.zip/photos/" + merged[i].series[j];
            }

        }*/
    }, [prop])

    const musicStart = () => {

        if (prop && prop.glavs[activeTema].hasOwnProperty("music") && prop.glavs[activeTema].music.length - 1 >= activeGlav) {
            if(platform === IOS)
                setMusic(false)
            if (musicBlock) {
                musicBlock.pause();
            }
            if (!prop.glavs[activeTema].has_music)
                return false;
            let audioUrl = `https://foxcomics.ru${prop.glavs[activeTema].path}/music/${activeGlav + 1}.wav`
            /* if(activeTema >= 1){
                 if(!prop.glavs[activeTema].has_music)
                     return false;
                 audioUrl = `https://foxcomics.ru${prop.glavs[activeTema].path}/music/${activeGlav + 1}.wav`
             }*/

            let audio = new Audio();
            audio.src = audioUrl;
            audio.type = 'audio/x-wav';
            audio.loop = true;

            audio.addEventListener('error', function () {
                //alert('Audio error: ' + audioUrl + '; ' + JSON.stringify(audio.error));
                //$('#audioStatus').html('Audio error: ' + audioUrl + '; ' + JSON.stringify(audio.error));
            });

            audio.addEventListener('play', function () {
                //alert('Starting audio: ' + audioUrl + '; MIME-type: ' + audio.type);
                $('#audioStatus').html('Playing audio: ' + audioUrl);
            });

            audio.addEventListener('ended', function () {
                //alert('Playback ended: ' + audioUrl);
                $('#audioStatus').html('Stopped...');
            });

            audio.addEventListener('canplay', function () {

            });
            setMusicBlock(audio)
            try {
                if (music)
                    audio.play();
            } catch (e) {
                setMusic(false)
            }


        }
    }
    useEffect(() => {
        if (activeGlav > 0) {
            setTimeout(() => {
                if ($($("img.scroll_img")[activeGlav]).offset() && $($("img.scroll_img")[activeGlav]).offset().top)
                    $('html, body').animate({
                        scrollTop: $($("img.scroll_img")[activeGlav]).offset().top
                    }, 500);
            }, 1000)

        }
        document.addEventListener("touchstart", () => {
            if (musicBlock && musicBlock.paused && music)
                musicBlock.play();
        });
    }, [])
    useEffect(() => {


    }, [prop, activeGlav])
    useEffect(() => {
        if (music && musicBlock) {
            musicBlock.play();
        } else if (musicBlock) {
            musicBlock.pause();
        }
    }, [music])

    useEffect(() => {
        if ((oldData.glav !== activeTema || oldData.serias !== activeGlav) && (oldData.glav < activeTema || oldData.serias < activeGlav)) {
            setOldData({...{glav: activeTema, serias: activeGlav}});
        } else {
        }
        musicStart();
    }, [activeTema, activeGlav])
    useEffect(() => {
        /*musicStart();*/
        MangaController.saveMomentView({manga_id: prop._id, glav: activeTema, serias: activeGlav})
    }, [oldData])
    const nextToolTip = () => {
        setTooltip(prevState => prevState + 1)
        bridge.send("VKWebAppStorageSet", {"key": "reading_tooltip", "value": String(tooltip + 1)});
    }
    useEffect(() => {
        bridge.send("VKWebAppStorageGet", {"keys": ["reading_tooltip"]}).then((r) => {
            console.log("RRRRRR", r)
            if (r && r.keys.length > 0) {
                if (r.keys[0].value === '') {
                    setShowMenu(true)
                    setTooltip(0)
                } else {
                    setShowMenu(true)
                    setTooltip(parseInt(r.keys[0].value))
                }
            } else {
                setTooltip(0)
            }
        });


        bridge.subscribe(({detail: {type, data}}) => {

            if (type === 'VKWebAppViewHide') {
                /* if (speech && window.speechSynthesis)
                     window.speechSynthesis.pause()*/
                try {
                    if (musicRef.current) {
                        musicRef.current.pause();
                        setMusic(false)
                    }
                } catch (e) {
                    setMusic(false)
                }

            }
            if (type === 'VKWebAppViewRestore') {
                /*if (speech)
                    window.speechSynthesis.resume()*/
                try {
                    if (musicRef.current && music) {
                        musicRef.current.play();
                        setMusic(true)
                    }

                } catch (e) {
                    setMusic(false)
                }

            }

        });

        MangaController.getCommentsfForRead({manga_id: prop._id}).then((r) => {
            sortComments(r.comments)
        })
        if (!prop.hasOwnProperty("text")) {
            //setPop(loadAlert)
            var imgs = document.images,
                len = imgs.length,
                counter = 0;

            [].forEach.call(imgs, function (img) {
                if (img.complete)
                    incrementCounter();
                else
                    img.addEventListener('load', incrementCounter, false);
            });

            function incrementCounter() {
                counter++;

                if (counter === len) {

                    setPop(null)

                }
            }
        }

    }, [])
    let loaded = false;
    useEffect(() => {
        if (prop !== null && !prop.hasOwnProperty("text"))
            if (!loaded) {
                prop.glavs.forEach(element => {
                    element.series.forEach(image => {
                        let curImg = new Image();
                        curImg.src = "https://foxcomics.ru/mangas/1634564543глава%201%20готово.zip/photos/" + image;
                    })
                })
            }
    }, [prop])
    const sendComment = (e) => {
        let mess = $('#comment_to_tight').val();
        if (mess) {
            MangaController.addComment(
                {
                    manga_id: prop._id,
                    mess: mess,
                    answer: answer,
                    spoiler: spoiler,
                    glav_id: activeTema,
                    page_id: activeGlav
                }).then(() => {
                MangaController.getCommentsfForRead({manga_id: prop._id}).then((r) => {
                    sortComments(r.comments)
                })
            })
        }
        $('#comment_to_tight').val("");
    }
    const clickImg = (e) => {
        console.log(e.target.className)
        if (e.target.className === "reading_set_block" || e.target.tagName === "use" || e.target.tagName === "svg" ||
            e.target.className.indexOf("Tooltip") !== -1)
            return false;
        let target = $(e.target).attr('id');

        if (target === undefined) {
            setShowMenu(prevState => !prevState)
            return false;
        }
        if (target === "blog_blog" || target === "for_target_click" || $(e.target).hasClass("reading_div")) {
            setShowMenu(prevState => !prevState)
        }


    }
    /* var speak = function speak(text) {
         var synth = window.speechSynthesis;
         synth.speak(new SpeechSynthesisUtterance('Hello World'));
     };*/
    useEffect(() => {
        /*if (prop.hasOwnProperty("text")) {
            if (speech && prop.hasOwnProperty("text") && prop.glavs && prop.glavs[activeTema].text) {
                speak(prop.glavs[activeTema].text)
                console.log("STARTATAT")
                if (window.speechSynthesis)
                    window.speechSynthesis.resume()
            } else {
                if (window.speechSynthesis)
                    window.speechSynthesis.pause();
            }
        }*/

    }, [speech])
    useEffect(() => {

        /*if (scrollMode) {
            $('html, body').animate({
                scrollTop: $("div").find("[data-glav='" + activeGlav + "']").offset().top
            }, 500);
        }*/

        /* allow_detec = true;
       //  setPop(loadAlert)

         var imgs = document.images,
             len = imgs.length,
             counter = 0;

         [].forEach.call(imgs, function (img) {
             if (img.complete)
                 incrementCounter();
             else
                 img.addEventListener('load', incrementCounter, false);
         });

         function incrementCounter() {
             counter++;
             if (counter === len) {

                 setPop(null)
                 if (scrollRef.current) {
                     $('html, body').animate({
                         scrollTop: $("div").find("[data-glav='" + glavRef.current + "']").offset().top
                     }, 500);
                 } else
                     window.scrollTo(0, 0);
             }
         }*/
    }, [scrollMode])
    const prevGlav = () => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        if (prop.hasOwnProperty("text") && prop.text) {
            if (activeTema - 1 >= 0) {
                setActiveTema(prevState => prevState - 1)
                window.scrollTo(0, 0);
            }
        }
    }
    const nextGlav = () => {

        document.body.scrollTop = document.documentElement.scrollTop = 0;
        if (prop.hasOwnProperty("text") && prop.text) {
            if (activeTema < prop.glavs.length - 1) {
                setPageX(prevState => prevState + 1)
                setActiveTema(prevState => prevState + 1)
                window.scrollTo(0, 0);
            } else {
                if (musicBlock)
                    musicBlock.pause();
                setActivePanel("home")
                setActiveGlav(0)
                setActiveTema(0)
            }
        } else {
            if (activeGlav >= prop.glavs[activeTema].series.length - 1) {
                if (prop.glavs.length - 1 > activeTema) {
                    MangaController.getRaznicaDate(prop.glavs[activeTema + 1].days_allow).then((res) => {

                        if (res.result) {
                            setPageX(prevState => prevState + 1)
                            setActiveGlav(0)
                            setActiveTema(prevState => prevState + 1)
                            window.scrollTo(0, 0);
                        } else {
                            setSelectedGlav({
                                glav: activeTema + 1,
                                time: Helper.getNormalDate(prop.glavs[activeTema + 1].days_allow) === Helper.getNormalDate(new Date()) ? "скоро" : Helper.getNormalDate(prop.glavs[activeTema + 1].days_allow)
                            })
                            setActiveModal("readerror")
                        }
                    })
                    /*if(MangaController.getRaznicaDate(prop.glavs[activeTema+1].days_allow) || fetchedUser.vip){
                        setActiveGlav(0)
                        setActiveTema(prevState => prevState+1)
                        window.scrollTo(0, 0);
                    }else{

                    }*/
                } else {
                    setActivePanel("home")
                }
                if (!fetchedUser.vip)
                    bridge.send("VKWebAppShowNativeAds", {ad_format: "reward"});
                //Переклчюаем главу
            } else {

                //Ссерию
                setPageX(prevState => prevState + 1)
                setActiveGlav(prevState => prevState + 1)
                window.scrollTo(0, 0);
            }
        }

    }
    const inFavorit = (e) => {
        let what = e.currentTarget.dataset.what;//readed or think
        let pr = prop;
        let d = what === "readed" ? 1 : what === "reading" ? 3 : what === "otlj" ? 4 : what === "cross" ? 5 : what === "group" ? 6 : 2
        if (prop && pr.hasOwnProperty("static_block") && pr.static_block.hasOwnProperty("is_favor")) {
            pr.static_block.is_favor = d;

            setProp({...pr})
        }
        MangaController.addToFavorit({what: d, manga_id: prop._id}).then((rd) => {
            MangaController.getUpdate(rd._id).then((r) => {

                setProp(r)
            });
        });
    }
    const LikeToGlavPage = (e) => {
        /* let el = e.currentTarget;
         let w = parseInt(e.currentTarget.dataset.w);
         if (w === 0) {
             $(el).find("div svg use").css("color", "#fff");
             $(el).find(".nu_Semi_Bold").text(parseInt($(el).find(".nu_Semi_Bold").text()) - 1)
         } else {
             $(el).find("div svg use").css("color", "#735CE6");
             $(el).find(".nu_Semi_Bold").text(parseInt($(el).find(".nu_Semi_Bold").text()) + 1)
         }*/

        MangaController.addLikeManga({
            manga_id: prop._id,
            glava_id: activeTema,
            page_id: activeGlav
        }).then((rd) => {
            MangaController.getUpdate(rd._id).then((r) => {
                setProp(r)
            });
        })
    }
    const sortComButtons = (e, arr = null) => {
        let type;
        if (e === null)
            type = activeSort;
        else
            type = e.currentTarget.dataset.sort
        let coms = comments;
        if (arr !== null)
            coms = arr;
        setActiveSort(type)
        if (prop.hasOwnProperty("text")) {
            if (type === "new") {
                coms[activeTema].sort((a, b) => {
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
                coms[activeTema].sort((a, b) => {
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
        } else {
            if (type === "new") {
                coms[activeTema][activeGlav].sort((a, b) => {
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
                coms[activeTema][activeGlav].sort((a, b) => {
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
        }

        if (arr === null)
            setComments([...coms])
        else return coms;

    }
    const getThisImages = () => {
        let merged = [].concat.apply([], prop.glavs);
        let d = [];
        for (let i = 0; i < merged.length; i++) {
            for (let j = 0; j < merged[i].series.length; j++) {
                d.push(<img
                    src={"https://foxcomics.ru/mangas/1635188487глава 1 готово.zip/photos/" + merged[i].series[j]}/>)
            }

        }
        return d;
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
    const startMusic = () => {
        if (musicBlock && music)
            musicBlock.play();
    }
    return (
        <View popout={popout}
              modal={<ReadingSettings tema={tema} selectedGlav={selectedGlav} bridge={bridge} openUser={openUser}
                                      activeSort={activeSort} setActiveSort={setActiveSort}
                                      sortComButtons={sortComButtons} sortComments={sortComments} prop={prop}
                                      setComments={setComments} MangaController={MangaController}
                                      activeGlav={activeGlav} activeTema={activeTema} comments={comments}
                                      backgroundColor={backgroundColor} setBackground={setBackground} color={color}
                                      setColor={setColor} font={font} setFont={setFont} fontSize={fontSize}
                                      setFontSize={setFontSize} activeModal={activeModal}
                                      setActiveModal={setActiveModal}/>} activePanel={id}>
            <Panel id={id}>

                <PanelHeader separator={false} shadow={false}
                             left={
                                 <Icon24ChevronLeft style={{marginLeft: 15}}
                                                    className={`backReding ${Helper.getColorForTheme(tema)}`}
                                                    onClick={() => {
                                                        /*if (window.speechSynthesis)
                                                            window.speechSynthesis.cancel()*/
                                                        if (musicBlock)
                                                            musicBlock.pause();
                                                        setActivePanel("home")
                                                    }}/>
                             }>
                    <Tabs>
                        <TabsItem
                            className={"hellow_tabs"}
                            style={{top:platform === IOS ? 48 : 0}}
                            onClick={() => {
                                setOpenMenu(prevState => !prevState)
                            }}
                            after={<Icon16Dropdown className={Helper.getColorForTheme(tema)} style={{
                                transform: `rotate(${openMenu ? '180deg' : '0'}) translateY(1px)`
                            }}/>}
                        >
                            <span
                                className={`nu_Semi_Bold ${Helper.getColorForTheme(tema)}`}>Глава {activeTema + 1}</span>
                        </TabsItem>
                    </Tabs>
                </PanelHeader>
                <PanelHeaderContext
                    opened={openMenu}

                    onClose={() => setOpenMenu(false)}
                >
                    <List >
                        {prop.glavs.map((item, key) => (
                            <Cell
                                after={activeTema === key ? <Icon28CheckCircleOn fill="#937FF5"/> : null}
                                className={"nu_Semi_Bold"}
                                onClick={(e) => {
                                    setOpenMenu(false)
                                    MangaController.getRaznicaDate(prop.glavs[key].days_allow).then((res) => {
                                        if (res.result) {
                                            setActiveTema(key)
                                            setActiveGlav(0);
                                            window.scrollTo(0, 0);
                                        } else {
                                            setSelectedGlav({
                                                glav: activeTema + 1,
                                                time: Helper.getNormalDate(prop.glavs[activeTema + 1].days_allow)
                                            })
                                            setActiveModal("readerror")
                                        }
                                    })
                                    /* if(MangaController.getRaznicaDate(prop.glavs[parseInt(e.currentTarget.dataset.mode)].days_allow) || fetchedUser.vip){
                                         setActiveTema(parseInt(e.currentTarget.dataset.mode))
                                         setActiveGlav(0);
                                         window.scrollTo(0, 0);
                                     }else{
                                         setSelectedGlav({glav:activeTema+1,time: Helper.getNormalDate(prop.glavs[activeTema + 1].days_allow)})
                                         setActiveModal("readerror")
                                     }*/

                                }}
                                data-mode={key}

                            >
                                Глава {key + 1}
                            </Cell>
                        ))
                        }
                    </List>
                </PanelHeaderContext>

                <div className="reading_div" style={prop.hasOwnProperty("text") ? {
                    backgroundColor: backgroundColor.hex,
                    minHeight: "100vh"
                } : {}} onClick={clickImg}>
                    <Tooltip onClose={nextToolTip}
                             className={"toollllTip"}
                             isShown={tooltip === 0}
                             text="При тапе на данную зону, вы можете открыть настройки">
                        <div id={"for_target_click"}
                             className={`reading_settings ${showMenu ? "show_menu" : "no_show"}`}>
                            <div className="reading_set_block">
                                {!prop.hasOwnProperty("text") ?
                                    <Title className="tight_title nu_Bold" level={3}
                                           weight>{`${activeGlav + 1}/${prop.glavs[activeTema].series.length}`}</Title> :
                                    <Title className="tight_title nu_Bold" level={3}
                                           weight>{`${activeTema + 1}/${prop.glavs.length}`}</Title>
                                }

                            </div>
                            <div className="reading_buttons_column">
                                {prop.hasOwnProperty("text") &&
                                <div onClick={() => setActiveModal("settings")} className="reading_set_block">
                                    <Icon28SettingsOutline fill={"white"}/>
                                </div>
                                }

                                {!prop.hasOwnProperty("text") &&
                                <Tooltip onClose={nextToolTip}
                                         isShown={tooltip === 1}
                                         className={"toollllTip"}
                                         text="Можно выбрать между скрольной версией или постраничной">
                                    <div onClick={() => {
                                        setScrollMode(prevState => !prevState)
                                    }} className="reading_set_block">
                                        {!scrollMode ?
                                            <Icon28BillSeparatedOutline fill={"white"}/>
                                            :
                                            <Icon56FragmentsOutline width={28} height={28} fill={"white"}/>
                                        }

                                    </div>
                                </Tooltip>
                                }


                                {prop.glavs[activeTema].has_music &&
                                <Tooltip onClose={nextToolTip}
                                         isShown={tooltip === 2}
                                         className={"toollllTip"}
                                         text="Если в произведении есть музыка, вы так же можете её включать. К сожалению на IOS придется на каждой новой странице включать музыку повторно">
                                    <div onClick={() => {
                                        if (prop && prop.glavs[activeTema].hasOwnProperty("music") && prop.glavs[activeTema].music.length - 1 >= activeGlav && !music) {
                                            /*if (musicBlock) {
                                                alert("ASD")
                                                musicBlock.pause();
                                                setMusic(false)
                                                return false;
                                            }
                                            alert("!")*/
                                            if (!prop.glavs[activeTema].has_music)
                                                return false;
                                            let audioUrl = `https://foxcomics.ru${prop.glavs[activeTema].path}/music/${activeGlav + 1}.wav`
                                            /* if(activeTema >= 1){
                                                 if(!prop.glavs[activeTema].has_music)
                                                     return false;
                                                 audioUrl = `https://foxcomics.ru${prop.glavs[activeTema].path}/music/${activeGlav + 1}.wav`
                                             }*/

                                            let audio = new Audio();
                                            audio.src = audioUrl;
                                            audio.type = 'audio/x-wav';
                                            audio.loop = true;

                                            audio.addEventListener('error', function () {
                                                //alert('Audio error: ' + audioUrl + '; ' + JSON.stringify(audio.error));
                                                //$('#audioStatus').html('Audio error: ' + audioUrl + '; ' + JSON.stringify(audio.error));
                                            });

                                            audio.addEventListener('play', function () {
                                                //alert('Starting audio: ' + audioUrl + '; MIME-type: ' + audio.type);

                                            });

                                            audio.addEventListener('ended', function () {
                                                //alert('Playback ended: ' + audioUrl);

                                            });

                                            audio.addEventListener('canplay', function () {

                                            });
                                            setMusicBlock(audio)
                                            setMusic(true)
                                            audio.play();
                                        } else {
                                            if (musicBlock) {
                                                musicBlock.pause();
                                                setMusic(false)
                                            }
                                        }
                                    }} className="reading_set_block">
                                        {!music ?
                                            <Icon28MuteOutline fill={"white"}/>
                                            :
                                            <Icon28VolumeOutline fill={"white"}/>
                                        }

                                    </div>
                                </Tooltip>
                                }
                                {/*  {prop.has_music && platform !== IOS && !prop.hasOwnProperty("text") &&
                            <div onClick={startMusic} className="reading_set_block">
                                <Icon28Play fill={"white"}/>
                            </div>
                            }*/}
                                {!prop.hasOwnProperty("text") &&
                                <div onClick={() => setActiveModal("comments")}
                                     className="reading_set_block read_comments">

                                    <Counter className={"mess_indicator"} size="s" mode="prominent">
                                        {!prop.hasOwnProperty("text") ?
                                            <span
                                                className="nu_Semi_Bold">{!comments && 0}{comments && comments[activeTema] && comments[activeTema][activeGlav] && comments[activeTema][activeGlav].length}</span>
                                            :
                                            <span
                                                className="nu_Semi_Bold">{!comments && 0}{comments && comments[activeTema] && comments[activeTema].length}</span>
                                        }

                                    </Counter>
                                    <Icon28CommentOutline fill={"white"}/>
                                </div>
                                }


                            </div>
                        </div>
                    </Tooltip>


                    {prop.hasOwnProperty("text") && prop.text &&
                    <div className="for_read_buttons">
                        <div onClick={prevGlav} id={"for_read_back"}/>
                        <div onClick={nextGlav} id={"for_read_next"}/>
                    </div>
                    }

                    {prop.hasOwnProperty("text") && prop.text ?
                        (<div>
                            {!scrollMode && activeGlav === 0 &&
                            <div style={{backgroundColor: backgroundColor.hex, color: color.hex}} id={"blog_blog"}
                                 className="text_blog">
                                <Title style={{fontSize: fontSize + 6, lineHeight: `${fontSize + 13}px`}}
                                       className={`tight_title ${HelperD.getFont(font, 0)}`} level={2}
                                       weight>{prop.name ? prop.name : "Манга"}</Title>
                                <div className="glav_titles">
                                    <Title style={{fontSize: fontSize + 3, lineHeight: `${fontSize + 10}px`}}
                                           className={`tight_title ${HelperD.getFont(font, 0)} oglavlenie`} level={3}
                                           weight>Оглавление</Title>
                                    {prop.glavs.map((item, key) => (
                                        <Title style={{fontSize: fontSize + 3, lineHeight: `${fontSize + 10}px`}}
                                               className={`tight_title ${HelperD.getFont(font, 2)} `} level={3}
                                               weight>{item.name}</Title>
                                    ))}
                                </div>
                                <Title style={{
                                    marginBottom: 20,
                                    marginTop: 50,
                                    fontSize: fontSize + 6,
                                    lineHeight: `${fontSize + 13}px`
                                }} className={`tight_title ${HelperD.getFont(font, 0)}`} level={2}
                                       weight>{prop.glavs[activeTema].name}</Title>
                                <Title style={{
                                    textAlign: "left",
                                    fontSize: fontSize + 3,
                                    lineHeight: `${fontSize + 10}px`
                                }}
                                       className={`tight_title all_text_text ${HelperD.getFont(font, 1)}`} level={3}
                                       weight dangerouslySetInnerHTML={{__html: prop.glavs[activeTema].text}}/>
                            </div>
                            }
                            {scrollMode && prop.glavs && prop.glavs.map((item, key) => {
                                if (key === 0) {
                                    return (
                                        <div style={{
                                            backgroundColor: backgroundColor.hex,
                                            padding: 10,
                                            color: color.hex
                                        }} key={key}
                                             data-glav={key} id={"blog_blog"} className="text_blog scroll_img">
                                            <Title style={{fontSize: fontSize + 6, lineHeight: `${fontSize + 13}px`}}
                                                   className={`tight_title ${HelperD.getFont(font, 0)}`} level={2}
                                                   weight>{prop.name ? prop.name : "Манга"}</Title>
                                            <div className="glav_titles">
                                                <Title
                                                    style={{fontSize: fontSize + 3, lineHeight: `${fontSize + 10}px`}}
                                                    className={`tight_title ${HelperD.getFont(font, 0)} oglavlenie`}
                                                    level={3}
                                                    weight>Оглавление</Title>
                                                {prop.glavs && prop.glavs.map((item, key) => (
                                                    <Title style={{
                                                        fontSize: fontSize + 3,
                                                        lineHeight: `${fontSize + 10}px`
                                                    }}
                                                           className={`tight_title ${HelperD.getFont(font, 2)} `}
                                                           level={3}
                                                           weight>{item.name}</Title>
                                                ))}
                                            </div>
                                            <Title style={{
                                                marginBottom: 20,
                                                marginTop: 50,
                                                fontSize: fontSize + 6,
                                                lineHeight: `${fontSize + 13}px`
                                            }} className={`tight_title ${HelperD.getFont(font, 0)}`} level={2}
                                                   weight>{item.name}</Title>
                                            <Title style={{
                                                textAlign: "left",
                                                fontSize: fontSize + 3,
                                                lineHeight: `${fontSize + 10}px`
                                            }}
                                                   className={`tight_title all_text_text ${HelperD.getFont(font, 1)}`}
                                                   level={3}
                                                   weight dangerouslySetInnerHTML={{__html: item.text}}/>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div style={{
                                            backgroundColor: backgroundColor.hex,
                                            padding: 10,
                                            color: color.hex
                                        }} key={key}
                                             data-glav={key} id={"blog_blog"} className="text_blog scroll_img">
                                            <Title style={{marginBottom: 20, marginTop: 50, fontSize: fontSize + 6}}
                                                   className={`tight_title ${HelperD.getFont(font, 0)}`} level={2}
                                                   weight>{item.name}</Title>
                                            <Title style={{textAlign: "left", fontSize: fontSize + 3}}
                                                   className={`tight_title all_text_text ${HelperD.getFont(font, 1)}`}
                                                   level={3}
                                                   weight dangerouslySetInnerHTML={{__html: item.text}}/>
                                        </div>
                                    )
                                }

                            })}
                            {!scrollMode && activeGlav > 0 &&
                            <div style={{backgroundColor: backgroundColor.hex, padding: 10, color: color.hex}}
                                 id={"blog_blog"}
                                 className="text_blog">
                                <Title style={{
                                    marginBottom: 20,
                                    marginTop: 50,
                                    fontSize: fontSize + 6,
                                    lineHeight: `${fontSize + 13}px`
                                }} className={`tight_title ${HelperD.getFont(font, 0)}`} level={2}
                                       weight>{prop.glavs && prop.glavs[activeTema].name}</Title>
                                <Title style={{
                                    textAlign: "left",
                                    fontSize: fontSize + 3,
                                    lineHeight: `${fontSize + 10}px`
                                }}
                                       className={`tight_title all_text_text ${HelperD.getFont(font, 1)}`} level={3}
                                       weight
                                       dangerouslySetInnerHTML={{__html: prop.glavs ? prop.glavs[activeTema].text : ""}}/>
                            </div>
                            }
                        </div>) : (
                            <div style={{display: "flex", flexDirection: "column"}}>
                                {scrollMode && prop.glavs[activeTema].series.map((item, key) => (
                                    <LazyLoadImage
                                        key={key} id={"blog_blog"}
                                        className="scroll_img" data-glav={key}
                                        effect="blur"
                                        threshold={1000}
                                        src={`https://foxcomics.ru${prop.glavs[activeTema].hasOwnProperty("path") ? prop.glavs[activeTema].path : prop.path}/photos/` + item}
                                    />
                                    /*<img key={key} id={"blog_blog"}
                                         className="scroll_img" data-glav={key}
                                         src={`https://foxcomics.ru${prop.glavs[activeTema].hasOwnProperty("path") ? prop.glavs[activeTema].path : prop.path}/photos/` + item}/>*/
                                ))}
                                {!scrollMode &&
                                <LazyLoadImage
                                    id={"blog_blog"}
                                    effect="blur"
                                    threshold={1000}
                                    src={`https://foxcomics.ru${prop.glavs[activeTema].hasOwnProperty("path") ? prop.glavs[activeTema].path : prop.path}/photos/` + prop.glavs[activeTema].series[activeGlav]}
                                />
                                    /* <img id={"blog_blog"}
                                          src={`https://foxcomics.ru${prop.glavs[activeTema].hasOwnProperty("path") ? prop.glavs[activeTema].path : prop.path}/photos/` + prop.glavs[activeTema].series[activeGlav]}/>*/
                                }
                            </div>
                        )
                    }


                    {/*{scrollMode && glav.map((item, key) => (
                        <img key={key} id={"blog_blog"}
                             className="scroll_img" data-glav={key}
                             src={ApiController.url + "/mangas/1634564543глава%201%20готово.zip/photos/" + item}/>
                    ))}
                    {!scrollMode &&
                    <img id={"blog_blog"}
                         src={ApiController.url + "/mangas/1634564543глава%201%20готово.zip/photos/" + glav[activeGlav]}/>
                    }*/}

                </div>
                <Div className={`reading_info ${Helper.getBackGroundForTheme(tema)}`}>
                    <div style={{marginBottom: 40}} className="glav_buttons_b">
                        <div onClick={() => {
                            window.scrollTo(0, 0);
                            nextGlav()
                        }} className="next_glav_text">
                            {prop.hasOwnProperty("text") && prop.text ?
                                <Title style={{fontSize: activeTema >= prop.glavs.length - 1 ? 16 : 15}}
                                       className="tight_title nu_Extra_Bold" level={3}
                                       weight>{"Следующая глава"}</Title>
                                :
                                <Title
                                    style={{fontSize: activeGlav >= prop.glavs[activeTema].series.length - 1 ? 16 : 15}}
                                    className="tight_title nu_Extra_Bold" level={3}
                                    weight>{activeGlav >= prop.glavs[activeTema].series.length - 1 ? "Следующая глава" : "Следующая страница"}</Title>
                            }
                            <Icon28Chevrons2LeftOutline className={"chevron_rotate"}/>
                        </div>
                        <div onClick={LikeToGlavPage}
                             data-w={prop && prop.hasOwnProperty("static_block") && prop.static_block.hasOwnProperty('ownLikes') && prop.static_block.ownLikes && prop.static_block.ownLikes.find(item => item.glava_id === activeTema && item.page_id === activeGlav) ? 0 : 1}
                             className={"glav_likes"}>
                            {prop && prop.hasOwnProperty("static_block") && prop.static_block.hasOwnProperty('ownLikes') && prop.static_block.ownLikes && prop.static_block.ownLikes.find(item => item.glava_id === activeTema && item.page_id === activeGlav) ?
                                <Icon20Like width={17} fill={"#735CE6"}/> :
                                <Icon20LikeOutline width={17} fill={"#735CE6"}/>
                            }

                            <Subhead className={"nu_Semi_Bold"} weight="regular"
                                     style={{color: "#735CE6"}}>{prop && prop.hasOwnProperty("static_block") && prop.static_block.hasOwnProperty('ownLikes') && prop.static_block.ownLikes_count &&
                            prop.static_block.ownLikes_count.filter(item => item.glava_id === activeTema && item.page_id === activeGlav) ?
                                prop.static_block.ownLikes_count.filter(item => item.glava_id === activeTema && item.page_id === activeGlav).length : 0}</Subhead>
                        </div>

                    </div>
                    <div style={{marginBottom: 40}}>
                        <Title style={{marginBottom: 15}} className={"nu_Extra_Bold"} level="2"
                               weight="regular">Добавить в избранное</Title>
                        <HorizontalScroll>
                            <div style={{display: 'flex'}}>
                                <HorizontalCell disabled={(prop.static_block && prop.static_block.is_favor === 3)}
                                                className={`favor_cell`}>
                                    <Button disabled={(prop.static_block && prop.static_block.is_favor === 3)}
                                            onClick={inFavorit} data-what={"reading"} before={<Icon28BookmarkOutline
                                        fill={prop.static_block && prop.static_block.is_favor !== 3 ? "white" : "rgb(147,127,245)"}/>}
                                            mode="outline"
                                            className={`favorite_button ${prop.static_block && prop.static_block.is_favor !== 3 ? "purple_gradient" : "favorite_button_checked"}`}
                                            style={prop.static_block && prop.static_block.is_favor !== 3 ? {color: "white"} : {}}
                                            size={"l"}>Читаю</Button>
                                </HorizontalCell>
                                <HorizontalCell disabled={(prop.static_block && prop.static_block.is_favor === 2)}
                                                className={`favor_cell`}>
                                    <Button disabled={(prop.static_block && prop.static_block.is_favor === 2)}
                                            onClick={inFavorit} data-what={"think"} before={<Icon24ClockOutline
                                        fill={prop.static_block && prop.static_block.is_favor !== 2 ? "white" : "rgb(147,127,245)"}/>}
                                            mode="outline"
                                            className={`favorite_button ${prop.static_block && prop.static_block.is_favor !== 2 ? "purple_gradient" : "favorite_button_checked"}`}
                                            style={prop.static_block && prop.static_block.is_favor !== 2 ? {color: "white"} : {}}
                                            size={"l"}>В планах</Button>
                                </HorizontalCell>
                                <HorizontalCell disabled={(prop.static_block && prop.static_block.is_favor === 1)}
                                                className={`favor_cell`}>
                                    <Button disabled={(prop.static_block && prop.static_block.is_favor === 1)}
                                            onClick={inFavorit} data-what={"readed"} before={<Icon28DoneOutline
                                        fill={prop.static_block && prop.static_block.is_favor !== 1 ? "white" : "rgb(147,127,245)"}/>}
                                            mode="outline"
                                            className={`favorite_button ${prop.static_block && prop.static_block.is_favor !== 1 ? "purple_gradient" : "favorite_button_checked"}`}
                                            style={prop.static_block && prop.static_block.is_favor !== 1 ? {color: "white"} : {}}
                                            size={"l"}>Прочитано</Button>
                                </HorizontalCell>
                                <HorizontalCell disabled={(prop.static_block && prop.static_block.is_favor === 4)}
                                                className={`favor_cell`}>
                                    <Button disabled={(prop.static_block && prop.static_block.is_favor === 4)}
                                            onClick={inFavorit} data-what={"otlj"} before={<Icon28PinDotOutline
                                        fill={prop.static_block && prop.static_block.is_favor !== 4 ? "white" : "rgb(147,127,245)"}/>}
                                            mode="outline"
                                            className={`favorite_button ${prop.static_block && prop.static_block.is_favor !== 4 ? "purple_gradient" : "favorite_button_checked"}`}
                                            style={prop.static_block && prop.static_block.is_favor !== 4 ? {color: "white"} : {}}
                                            size={"l"}>Отложено</Button>
                                </HorizontalCell>
                                <HorizontalCell disabled={(prop.static_block && prop.static_block.is_favor === 5)}
                                                className={`favor_cell`}>
                                    <Button disabled={(prop.static_block && prop.static_block.is_favor === 5)}
                                            onClick={inFavorit} data-what={"cross"} before={<Icon28DeleteOutlineAndroid
                                        fill={prop.static_block && prop.static_block.is_favor !== 5 ? "white" : "rgb(147,127,245)"}/>}
                                            mode="outline"
                                            className={`favorite_button ${prop.static_block && prop.static_block.is_favor !== 5 ? "purple_gradient" : "favorite_button_checked"}`}
                                            style={prop.static_block && prop.static_block.is_favor !== 5 ? {color: "white"} : {}}
                                            size={"l"}>Брошено</Button>
                                </HorizontalCell>
                                <HorizontalCell disabled={(prop.static_block && prop.static_block.is_favor === 6)}
                                                className={`favor_cell`}>
                                    <Button disabled={(prop.static_block && prop.static_block.is_favor === 6)}
                                            onClick={inFavorit} data-what={"group"} before={<Icon28BlockOutline
                                        fill={prop.static_block && prop.static_block.is_favor !== 6 ? "white" : "rgb(147,127,245)"}/>}
                                            mode="outline"
                                            className={`favorite_button ${prop.static_block && prop.static_block.is_favor !== 6 ? "purple_gradient" : "favorite_button_checked"}`}
                                            style={prop.static_block && prop.static_block.is_favor !== 6 ? {color: "white"} : {}}
                                            size={"l"}>Без группы</Button>
                                </HorizontalCell>

                            </div>
                        </HorizontalScroll>
                    </div>
                    {prop !== null && prop.glavs[activeTema].hasOwnProperty("persons") && prop.glavs[activeTema].persons !== null && prop.glavs[activeTema].persons.length > 0 &&
                    <div style={{marginBottom: 40}}>
                        <Title style={{marginBottom: 15}} className={"nu_Extra_Bold"} level="2"
                               weight="regular">Главные действующие лица</Title>
                        <HorizontalScroll>

                            <div className="people">
                                {prop.glavs[activeTema].persons.map((item, key) => (
                                    <div onClick={() => openUser(item, true)} className="people_info ">
                                        <div className={`yes_persons`}>
                                            <Avatar size={54} className={"avatar_people"}
                                                    src={`https://foxcomics.ru/uploads/${item.photo ? item.photo : null}`}/>
                                        </div>

                                        <Subhead
                                            style={{
                                                textAlign: "center",
                                                whiteSpace: "normal",
                                                fontSize: 14,
                                                marginTop: 5,
                                                marginBottom: 2
                                            }}
                                            className={`nu_Semi_Bold articleName nameOfThisPersons ${Helper.getColorForTheme(tema)}`}
                                            level="3"
                                            weight="regular">{item.name ? item.name : "Персонаж"}</Subhead>


                                    </div>
                                ))}
                            </div>
                        </HorizontalScroll>
                    </div>
                    }
                    {prop !== null && prop.creators &&
                    <div style={{marginBottom: 40}}>
                        <Title style={{marginBottom: 15}} className={"nu_Extra_Bold"} level="2"
                               weight="regular">Над
                            проектом работали</Title>
                        <HorizontalScroll>

                            <div className="people">
                                {prop.creators.map((item, key) => {
                                    return (
                                        <User onClick={openUser} item={item}/>
                                    )
                                })}
                            </div>
                        </HorizontalScroll>
                    </div>
                    }
                    <Group separator={"hide"}>
                        <div className="tight_comments">
                            <div className="tight_comments_buttons">
                                <Button onClick={sortComButtons} data-sort={"new"}
                                        style={activeSort === "new" ? {
                                            marginRight: 10,
                                            color: "white"
                                        } : {color: "#99A2AD", marginRight: 10}} size={"s"}
                                        mode={activeSort === "new" ? `` : "tertiary"}
                                        className={`${activeSort === "new" ? "purple_gradient" : ""} noBorder nu_Regular`}>Новое</Button>
                                <Button onClick={sortComButtons} data-sort={"pop"} size={"s"}
                                        style={activeSort === "pop" ? {color: "white"} : {color: "#99A2AD"}}
                                        className={`${activeSort === "pop" ? "purple_gradient" : ""} nu_Regular`}
                                        mode={activeSort === "new" ? `tertiary` : ""}>Популярное</Button>
                            </div>
                            {!prop.hasOwnProperty("text") && comments && comments[activeTema] && comments[activeTema][activeGlav] && comments[activeTema][activeGlav].length === 0 &&
                            <Placeholder
                                className={"readPlaceHolder"}
                                icon={<Icon28CommentOutline width={56} height={56} fill={"#735CE6"}/>}
                                header="Комментарии"
                            >
                                К сожалению ещё никто не оставлял комментарии.
                            </Placeholder>
                            }
                            {!prop.hasOwnProperty("text") && comments && comments[activeTema] && comments[activeTema][activeGlav] && comments[activeTema][activeGlav].map((item, key) => (
                                <div className={`comment`}>
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
                                        let commnetse = comments;
                                        commnetse[activeTema][activeGlav][key].spoiler = !commnetse[activeTema][activeGlav][key].spoiler;
                                        setComments([...commnetse])

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
                                            /*$('html, body').animate({
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
                                                        let commnetse = comments;
                                                        commnetse[activeTema][activeGlav][key].spoiler = !commnetse[activeTema][activeGlav][key].spoiler;
                                                        setComments([...commnetse])

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
                            {prop.hasOwnProperty("text") && comments && comments[activeTema] && comments[activeTema] && comments[activeTema].map((item, key) => (
                                <div className="comment">
                                    <div className="comment_info">
                                        <Avatar onClick={() => openUser(item.user)} style={{marginRight: 10}} size={48}
                                                className={"avatar_people"}
                                                src={item.user.photo_100}/>
                                        <div className="comment_name">
                                            <Title className="tight_title nu_Bold d11" level={3}
                                            >{item.user.name}</Title>
                                            <Subhead className="nu_Semi_Bold" weight="regular"
                                                     style={{color: "#99A2AD"}}>{getTimeWhen(item.when_created)}</Subhead>
                                        </div>

                                    </div>
                                    <div onClick={() => {
                                        let commnetse = comments;
                                        commnetse[activeTema][activeGlav][key].spoiler = !commnetse[activeTema][activeGlav][key].spoiler;
                                        setComments([...commnetse])

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
                                            $('html, body').animate({
                                                scrollTop: $("#comment_to_tight1").offset().top
                                            }, 500);
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
                                                        <Avatar onClick={() => openUser(itemd.user)}
                                                                style={{marginRight: 10}} size={48}
                                                                className={"avatar_people"}
                                                                src={itemd.user.photo_100}/>
                                                        <div className="comment_name">
                                                            <Title className="tight_title nu_Bold d11" level={3}
                                                            >{itemd.user.name}</Title>
                                                            <Subhead className="nu_Semi_Bold" weight="regular"
                                                                     style={{color: "#99A2AD"}}>{getTimeWhen(itemd.when_created)}</Subhead>
                                                        </div>

                                                    </div>
                                                    <div onClick={() => {
                                                        let commnetse = comments;
                                                        commnetse[activeTema][activeGlav][key].spoiler = !commnetse[activeTema][activeGlav][key].spoiler;
                                                        setComments([...commnetse])

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
                            {prop.hasOwnProperty("text") && comments && comments[activeTema] && comments[activeTema] && comments[activeTema].length === 0 &&
                            <Placeholder
                                icon={<Icon28CommentOutline width={56} height={56} fill={"#735CE6"}/>}
                                header="Комментарии"
                            >
                                К сожалению ещё никто не оставлял комментарии.
                            </Placeholder>
                            }


                        </div>
                    </Group>
                    <Group separator={"hide"} style={{marginTop: 50}}>
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
                </Div>
                {/*{prop.music && prop.music.length-1 >= activeGlav && music &&
                <audio id={"myAudio"} autoPlay controls loop >
                    <source src={`https://foxcomics.ru/mangas/1635096681глава%201%20готово.zip/music/${activeGlav+1}.wav`} type="audio/ogg"/>
                </audio>
                }*/}
            </Panel>
        </View>
    )
}

export default Reading;