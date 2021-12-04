import React, {useEffect, useState, Fragment} from "react"
import {
    ANDROID, Avatar, Button, Div, Group, Header, IconButton,
    IOS, ModalCard,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    PanelHeaderButton,
    PanelHeaderClose, Placeholder, Slider, Subhead, Title, useAdaptivity, usePlatform, ViewWidth, WriteBar, WriteBarIcon
} from "@vkontakte/vkui";
import {ColorPicker, useColor} from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import {
    Icon20Cancel,
    Icon24Dismiss,
    Icon28ChevronDownOutline,
    Icon28ChevronUpOutline, Icon28CommentOutline, Icon28HideOutline,
    Icon28LockOpenOutline, Icon28ViewOutline
} from "@vkontakte/icons";
import {Icon28ArrowRightSquareOutline} from '@vkontakte/icons';
import {Icon28TextCircleOutline} from '@vkontakte/icons';
import {Icon24BrushOutline} from '@vkontakte/icons';
import {Icon24TextOutline} from '@vkontakte/icons';
import $ from "jquery"
import Helper from "./Helper";
import {Icon56LockOutline} from '@vkontakte/icons';

const ReadingSettings = ({tema, selectedGlav, activeSort, bridge, openUser, sortComButtons, setActiveSort, sortComments, prop, setComments, comments, MangaController, activeGlav, activeTema, activeModal, setActiveModal, fontSize, backgroundColor, setBackground, setFontSize, font, setFont, color, setColor}) => {
    const modalBack = () => {
        if (activeModal === "settings") {
            bridge.send("VKWebAppStorageSet", {"key": "font", "value": font}).catch(() => console.log("err"));
            bridge.send("VKWebAppStorageSet", {
                "key": "background_color",
                "value": backgroundColor.hex
            }).catch(() => console.log("err2"));
            bridge.send("VKWebAppStorageSet", {"key": "color", "value": color.hex}).catch(() => console.log("err3"));
            bridge.send("VKWebAppStorageSet", {
                "key": "font_size",
                "value": String(fontSize)
            }).catch(() => console.log("err4"));
        }
        setPickFont(null)
        setActiveModal(null);
    }
    const HelperD = new Helper()
    const [spoiler,setSpoiler] = useState(false)
    const {viewWidth} = useAdaptivity();
    const isMobile = viewWidth <= ViewWidth.MOBILE;
    const platform = usePlatform();
    const [pickFont, setPickFont] = useState(null)
    const [answer, setAnswer] = useState(null)
    const fonts = [
        "Sansa",
        "Roboto",
        "Noto",
        "Roboto Slab",
        "Merriweather",
        "Playfair Display",
        "Lora",
        "Nunito",
    ]
    const left = () => {
        let index = fonts.indexOf(font)
        setFont(fonts[index >= fonts.length - 1 ? 0 : index + 1]);
    }
    const right = () => {
        let index = fonts.indexOf(font)
        setFont(fonts[index <= 0 ? fonts.length - 1 : index - 1]);
    }

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

    const setTheme = (e) => {

        let theme = `${e.currentTarget.dataset.theme}_p`;
        if (theme === "green_black_p") {

            setColor({hex: "#228B22", rgb: hexToRGB("#228B22"), hsv: hexToHSL("#228B22")})
            setBackground({hex: "#000000", rgb: hexToRGB("#000000"), hsv: hexToHSL("#000000")})
        } else if (theme === "black_white_p") {
            setColor({hex: "#FFFFFF", rgb: hexToRGB("#FFFFFF"), hsv: hexToHSL("#FFFFFF")})
            setBackground({hex: "#000000", rgb: hexToRGB("#000000"), hsv: hexToHSL("#000000")})
        } else if (theme === "bej_darkbej_p") {
            setColor({hex: "#644330", rgb: hexToRGB("#644330"), hsv: hexToHSL("#644330")})
            setBackground({hex: "#F5F0DD", rgb: hexToRGB("#F5F0DD"), hsv: hexToHSL("#F5F0DD")})
        } else if (theme === "white_black_p") {
            setColor({hex: "#3B3B39", rgb: hexToRGB("#3B3B39"), hsv: hexToHSL("#3B3B39")})
            setBackground({hex: "#F8F7F3", rgb: hexToRGB("#F8F7F3"), hsv: hexToHSL("#F8F7F3")})
        }

        $("#preview_this_j").removeClass("green_black_p black_white_p bej_darkbej_p white_black_p").addClass(theme)
    }
    const sendComment = (e) => {
        let mess = $('#comment_to_tight1').val();
        if (mess) {
            MangaController.addComment(
                {
                    manga_id: prop._id,
                    mess: mess,
                    answer: answer,
                    glav_id: activeTema,
                    page_id: activeGlav
                }).then(() => {
                MangaController.getCommentsfForRead({manga_id: prop._id}).then((r) => {
                    sortComments(r.comments)
                })
            })
        }
        $('#comment_to_tight1').val("");
    }
    const likeComment = (e) => {
        let like = parseInt(e.currentTarget.dataset.like);
        let comment_id = e.currentTarget.dataset.id;
        MangaController.likeComment({like: like, comment_id: comment_id, manga_id: prop._id}).then((rd) => {
            MangaController.getCommentsfForRead({manga_id: prop._id}).then((r) => {
                sortComments(r.comments)
            })
        })
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
    return (
        <ModalRoot
            activeModal={activeModal}
            onClose={modalBack}
        >
            <ModalPage
                id={"settings"}
                settlingHeight={100}
                onClose={modalBack}
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
                    <div onClick={() => {
                        if (pickFont !== null)
                            setPickFont(null)
                    }} className={"container_fff"}>
                        <div id={"preview_this_j"} style={{backgroundColor: backgroundColor.hex, color: color.hex}}
                             className="reading_settings_preview">
                            <Title style={{fontSize: fontSize + 3}}
                                   className={`tight_title ${HelperD.getFont(font, 0)} preview_text`} level={3}
                                   weight>Fox Comics</Title>
                        </div>
                    </div>

                    {pickFont !== null && pickFont &&
                    <div className="colorPcikererkerk">
                        <ColorPicker width={300} height={200} color={color} onChange={(e) => {
                            setColor(e)
                        }} hideHSV/>
                    </div>
                    }
                    {pickFont !== null && !pickFont &&
                    <div className="colorPcikererkerk">
                        <ColorPicker width={300} height={200} color={backgroundColor} onChange={setBackground} hideHSV/>
                    </div>
                    }


                    {pickFont === null && <div>
                        <Group style={{marginTop: 20}} separator={"hide"} header={
                            <Header>
                                <div className={"header_s"}>
                                    <Icon24BrushOutline style={{marginRight: 10}} fill={"#735CE6"}/>
                                    <span className="nu_Semi_Bold">Цвет фона и текста</span>
                                </div>

                            </Header>
                        }>
                            <div className="palitra_of_theme">
                                <div onClick={setTheme} data-theme={"green_black"} className="palitra green_black"/>
                                <div onClick={setTheme} data-theme={"black_white"} className="palitra black_white"/>
                                <div onClick={setTheme} data-theme={"bej_darkbej"} className="palitra bej_darkbej"/>
                                <div onClick={setTheme} data-theme={"white_black"} className="palitra white_black"/>
                            </div>

                        </Group>
                       {/* <Group style={{marginTop: 20}} separator={"hide"} header={
                            <Header className={"header_FFF"}>
                                <div className={"header_s al_d"}>
                                    <div className="headsdl_">
                                        <Icon28TextCircleOutline style={{marginRight: 10}} fill={"#735CE6"}/>
                                        <span className="nu_Semi_Bold">Размер текста</span>
                                    </div>

                                    <span className="nu_Semi_Bold">{fontSize}px</span>


                                </div>

                            </Header>
                        }>
                            <div className="get_font_size">
                                <Slider
                                    min={5}
                                    max={30}
                                    value={fontSize}
                                    onChange={value1 => setFontSize(parseInt(value1))}
                                />
                            </div>
                        </Group>*/}
                        <Group style={{marginTop: 40}} separator={"hide"}>
                            <div className="chose_fonts">
                                <div className="text_font">
                                    <Icon24TextOutline style={{marginRight: 20}} fill={"#735CE6"}/>

                                    <span className="nu_Semi_Bold">Шрифт</span>
                                </div>
                                <div className="chose_font_but">
                                    <IconButton onClick={right}
                                                children={<Icon28ArrowRightSquareOutline width={35} height={35}
                                                                                         className={"rotate_this"}
                                                                                         fill={"#735CE6"}/>}/>

                                    <span className={`nu_Semi_Bold ${Helper.getColorForTheme(tema)}`}
                                          style={{whiteSpace: "nowrap"}}>{font}</span>
                                    <IconButton onClick={left}
                                                children={<Icon28ArrowRightSquareOutline width={35} height={35}
                                                                                         fill={"#735CE6"}/>}/>

                                </div>
                            </div>
                        </Group>
                    </div>}


                    <div className="color_picker_buttons">
                        <div onClick={() => setPickFont(false)} className="op1">
                            <span className="nu_Semi_Bold">Фон</span>
                            <div style={{backgroundColor: backgroundColor.hex}} className={"back_pick_ vv"}/>
                        </div>
                        <div onClick={() => setPickFont(true)} className="op1">
                            <span className="nu_Semi_Bold">Шрифт</span>
                            <div style={{backgroundColor: color.hex}} className={"font_pick_ vv"}/>
                        </div>

                    </div>
                </Div>
            </ModalPage>
            <ModalPage
                id={"comments"}
                onClose={modalBack}
                dynamicContentHeight={true}
                header={
                    <ModalPageHeader
                        right={isMobile && platform === IOS &&
                        <PanelHeaderButton onClick={modalBack}><Icon24Dismiss/></PanelHeaderButton>}
                        left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={modalBack}/>}
                    >

                    </ModalPageHeader>
                }
            >
                <Group header={<Header>
                    {!prop.hasOwnProperty("text") ?
                        <Title level={2} className={"nu_Extra_Bold"}>
                            Комментарии
                            ({!comments && 0}{comments && comments[activeTema] && comments[activeTema][activeGlav] && comments[activeTema][activeGlav].length})
                        </Title> :
                        <Title level={2} className={"nu_Extra_Bold"}>
                            Комментарии ({!comments && 0}{comments && comments[activeTema] && comments[activeTema].length})
                        </Title>
                    }

                </Header>}>
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
                        {!prop.hasOwnProperty("text") && comments && comments[activeTema] && comments[activeTema][activeGlav] && comments[activeTema][activeGlav].length === 0 &&
                        <Placeholder
                            icon={<Icon28CommentOutline width={56} height={56} fill={"#735CE6"}/>}
                            header="Комментарии"
                        >
                            К сожалению ещё никто не оставлял комментарии.
                        </Placeholder>
                        }
                        {!prop.hasOwnProperty("text") && comments && comments[activeTema] && comments[activeTema][activeGlav] && comments[activeTema][activeGlav].map((item, key) => (
                            <div className="comment">
                                <div className="comment_info">
                                    <div
                                        className={`avatarBorder ${item.user && item.user.hasOwnProperty("avatar_border") ?
                                            HelperD.getNameOfBorder(item.user.avatar_border) : HelperD.getNameOfBorder(0)}`}>
                                        <Avatar onClick={() => openUser(item.user)} style={{marginRight: 10}} size={48}
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
                                        $('html, body').animate({
                                            scrollTop: $("#comment_to_tight1").offset().top
                                        }, 500);
                                    }} mode="tertiary"
                                            className={"purple_gradient_color nu_Semi_Bold"}>Ответить</Button>
                                    <div className="comment_buttons_rating">

                                        <Button onClick={likeComment} data-like={-1} data-id={item._id} mode="tertiary"
                                                before={<Icon28ChevronDownOutline className={"but_rating_icon"}
                                                                                  fill={item.likes.yor_like !== null && item.likes.yor_like.like === -1 ? "red" : "#99A2AD"}/>}/>
                                        <Subhead
                                            style={{color: item.likes.yor_like !== null ? item.likes.yor_like.like === 1 ? "green" : "red" : "grey"}}
                                            className="tight_title nu_Semi_Bold" level={3}
                                        >{item.likes.likes}</Subhead>
                                        <Button onClick={likeComment} data-like={1} data-id={item._id} mode="tertiary"
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

                                        <Button onClick={likeComment} data-like={-1} data-id={item._id} mode="tertiary"
                                                before={<Icon28ChevronDownOutline className={"but_rating_icon"}
                                                                                  fill={item.likes.yor_like !== null && item.likes.yor_like.like === -1 ? "red" : "#99A2AD"}/>}/>
                                        <Subhead
                                            style={{color: item.likes.yor_like !== null ? item.likes.yor_like.like === 1 ? "green" : "red" : "grey"}}
                                            className="tight_title nu_Semi_Bold" level={3}
                                        >{item.likes.likes}</Subhead>
                                        <Button onClick={likeComment} data-like={1} data-id={item._id} mode="tertiary"
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
                                                    <Avatar onClick={() => openUser(item.user)}
                                                            style={{marginRight: 10}} size={48}
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

                        <Group style={{marginTop: 50}}>
                            {spoiler &&
                            <div style={{width:"100%",display:"flex",justifyContent:"center"}}>
                                    <span  className="nu_Semi_Bold"
                                           style={{textAlign:"center",color: "red",fontSize:12}}>Комментарий помечен как - спойлер</span>
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
                                id={"comment_to_tight1"}
                                before={
                                    <WriteBarIcon onClick={()=>setSpoiler(prevState => !prevState)}>
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
                </Group>

            </ModalPage>

            <ModalCard
                id={"readerror"}
                onClose={() => setActiveModal(null)}
                icon={<Icon28LockOpenOutline width={54} height={54} fill={"#735CE6"}/>}
                header={`Глава ${selectedGlav && selectedGlav.glav + 1}`}
                subheader={`Станет бесплатно ${selectedGlav && selectedGlav.time}`}
                actions={
                    <Button className="purple_gradient noBorder nu_Regular" size="l" mode="primary"
                            onClick={() => setActiveModal(null)}>
                        Ок
                    </Button>
                }
            >

            </ModalCard>
        </ModalRoot>
    )
}
export default ReadingSettings;