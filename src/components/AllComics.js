import React, {Fragment, useEffect, useState} from "react";
import {
    ANDROID,
    IOS,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    Div,
    PanelHeaderButton,
    Spinner,
    PanelHeaderClose,
    useAdaptivity,
    usePlatform,
    ViewWidth,
    Title,
    Subhead,
    Separator,
    IconButton,
    WriteBar,
    WriteBarIcon, Group, Avatar, Button, Header
} from "@vkontakte/vkui";
import {Icon20Cancel, Icon24Dismiss, Icon28ChevronDownOutline, Icon28ChevronUpOutline} from "@vkontakte/icons";
import Comic from "./Comic";
import {Icon20ViewOutline} from '@vkontakte/icons';
import $ from "jquery";
import Article from "./Article";
import Helper from "./Helper";


const AllComics = ({setActiveModal, tema, NewsController, openNew, openUser, all_news, setActiveNew, news, getDate, set_BACK_FROM_TIGHT, openTight, activeModal, type, MangaController}) => {
    const HelperD = new Helper();
    const {viewWidth} = useAdaptivity();
    const isMobile = viewWidth <= ViewWidth.MOBILE;
    const platform = usePlatform();
    const [all_comics, setAllComics] = useState(null)
    const [answer, setAnswer] = useState(null)
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        if (news && !loaded) {
            setLoaded(true)
            NewsController.getNew({new_id: news._id}).then((r) => {
                setActiveNew(r)
            })
        }

    }, [news])
    const modalBack = () => {
        setLoaded(false)
        setActiveNew(null)
        setAllComics(null)
        setActiveModal(null)
    }
    const sendComment = () => {
        let mess = $('#comment_to_news').val();
        if (mess) {
            MangaController.addComment(
                {
                    manga_id: news._id,
                    mess: mess,
                    answer: answer,
                    com_type: "news"
                }).then(() => {
                NewsController.getNew({new_id: news._id}).then((r) => {
                    setActiveNew(r)
                })
            })
        }
        $('#comment_to_news').val("");
    }
    const likeComment = (e) => {
        let like = parseInt(e.currentTarget.dataset.like);
        let comment_id = e.currentTarget.dataset.id;
        MangaController.likeComment({
            like: like,
            comment_id: comment_id,
            manga_id: news._id,
            comm_type: "news"
        }).then((rd) => {
            NewsController.getNew({new_id: news._id}).then((r) => {
                setActiveNew(r)
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
                id={"all_comics"}
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


                {type !== null && type.length > 0 &&
                <div className="favor_list">
                    {type.map((item, key) => (
                        <Comic onClick={() => {
                            set_BACK_FROM_TIGHT("main")
                            openTight(item)
                        }} name={item.name} isNoCar={false} rating={item.sredRating}
                               img={`https://foxcomics.ru${item.avatar.substring(2).split(' ').join("%20")}`}/>
                    ))}
                </div>
                }
                {type === null &&
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <Spinner size="large" style={{margin: '20px 0'}}/>
                </div>
                }


            </ModalPage>
            <ModalPage id={"all_news"}
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
                <Div className="new_blocks">
                    {all_news && all_news.length && all_news.map((item, key) => (
                        <Article
                            style={{marginTop: 20}}
                            tema={tema}
                            onClick={() => openNew(item)}
                            views={item.views}
                            name={item.name}
                            when={getTimeWhen(item.when_created)}
                            img={`https://foxcomics.ru${item.avatar.substring(2).split(' ').join("%20")}`}/>
                    ))}
                </Div>
            </ModalPage>
            <ModalPage
                id={"new"}
                onClose={modalBack}
                dynamicContentHeight
                header={
                    <ModalPageHeader
                        right={isMobile && platform === IOS &&
                        <PanelHeaderButton onClick={modalBack}><Icon24Dismiss/></PanelHeaderButton>}
                        left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={modalBack}/>}
                    >
                        Статья
                    </ModalPageHeader>
                }
            >
                <Div>
                    {news &&
                    <div>
                        <div style={{padding:0}} className={"comic_div"}>
                            <div
                                style={{backgroundImage: `url('https://foxcomics.ru${news.avatar.substring(2).split(' ').join("%20")}')`}}
                                className="back_of_car_c"/>
                        </div>
                        <Title className={"nu_Extra_Bold new_name articleName"} level="2"
                               weight="regular">{news.name}</Title>
                        <div className="new_info">
                            <Subhead weight="regular"
                                     style={{color: "#99A2AD", margin: 5}}>{getDate(news.when_created)}</Subhead>
                            <Subhead weight="regular" style={{color: "#99A2AD", margin: 5}}>•</Subhead>
                            <Subhead weight="regular" style={{color: "#99A2AD", margin: 5}}>{news.views}</Subhead>
                            <Icon20ViewOutline style={{transform: "translate(0,2px)"}} fill={"#99A2AD"}/>
                        </div>
                        <Separator style={{margin: '10px 0'}}/>
                        <Title className={"nu_Bold new_name articleName"} level="3" weight="regular">
                            {news.text}
                        </Title>
                        <Separator style={{margin: '50px 0'}}/>
                        <Group header={<Header><Title className={"nu_Bold"} level={2}>Комментарии</Title></Header>}
                               style={{marginTop: 0}}>
                            {news.all_comments_normal && news.all_comments_normal.map((item, key) => (
                                <div className="comment news_comment">
                                    <div className="comment_info">
                                        <div
                                            className={`avatarBorder ${item.user && item.user.hasOwnProperty("avatar_border") ?
                                                HelperD.getNameOfBorder(item.user.avatar_border) : HelperD.getNameOfBorder(0)}`}>
                                            <Avatar onClick={() => openUser(item.user)} style={{marginRight: 10}}
                                                    size={48}
                                                    className={"avatar_people"}
                                                    src={item && item.hasOwnProperty("user") && item.user && item.user.hasOwnProperty("photo_100") && item.user.photo_100}/>
                                        </div>
                                        <div className="comment_name">
                                            <Title className="tight_title nu_Bold d11" level={3}
                                            >{item && item.user && item.user.name}</Title>
                                            <Subhead className="nu_Semi_Bold" weight="regular"
                                                     style={{color: "#99A2AD"}}>{getTimeWhen(item.when_created)}</Subhead>
                                        </div>

                                    </div>
                                    <div className="comment_text">
                                        <Title className="tight_title nu_Semi_Bold d11" level={3}>{item.mess}</Title>
                                    </div>

                                    <div className="comment_buttons">

                                        <Button onClick={() => {
                                            setAnswer(item)
                                            $('html, body').animate({
                                                scrollTop: $("#comment_to_news").offset().top
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
                                        {item.answers.map((item, key) => (
                                            <div key={key} className="answer">
                                                <div className="answer_line"/>
                                                <div className="comment">
                                                    <div className="comment_info">
                                                        <div
                                                            className={`avatarBorder ${item.user && item.user.hasOwnProperty("avatar_border") ?
                                                                HelperD.getNameOfBorder(item.user.avatar_border) : HelperD.getNameOfBorder(0)}`}>
                                                            <Avatar onClick={() => openUser(item.user)}
                                                                    style={{marginRight: 10}} size={48}
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
                                                    <div className="comment_text">
                                                        <Title className="tight_title nu_Semi_Bold d11"
                                                               level={3}>{item.mess}</Title>
                                                    </div>

                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    }
                                </div>
                            ))}
                            <div style={{marginTop: 20}}>
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
                                    id={"comment_to_news"}
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
                            </div>

                        </Group>
                    </div>
                    }
                </Div>
            </ModalPage>
        </ModalRoot>
    )
}
export default AllComics