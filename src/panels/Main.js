import React, {useEffect, useState, Fragment, memo} from "react";
import {Splide, SplideSlide} from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import {areEqual, FixedSizeList as List} from "react-window";
import {
    Group,
    Placeholder,
    Panel,
    PanelHeader,
    Title,
    Subhead,
    Banner,
    Headline,
    Avatar,
    View,
    Gallery,
    HorizontalScroll,
    Link,
    Spinner,
    CellButton
} from "@vkontakte/vkui";
import {Icon28UsersOutline, Icon56SearchLikeOutline} from '@vkontakte/icons';
import {Carousel as CarouselBoot} from "react-bootstrap"
import {Icon28Search} from '@vkontakte/icons';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel';
import Comic from "../components/Comic";
import Article from "../components/Article";
import {Icon24ChevronCompactRight} from '@vkontakte/icons';
import {Icon56MessagesOutline} from '@vkontakte/icons';
import Updates from "../components/Updates";
import Continue from "../components/Continue";
import AllComics from "../components/AllComics";
import MathJaxNode from "react-mathjax/lib/Node";
import {MathComponent} from "mathjax-react";
import AutoSizer from "react-virtualized-auto-sizer";

let link_to_mess = "https://vk.me/join/blsNAQ5c8tEutcjlwFAqZEUocyV_qefHFTs="
let link_group = "https://vk.com/ru.foxcomics"
let mun = "https://xlm.ru/storage/uploads/products/526/2019/08/20/EnX47P43UWxD35fLu1SLG5k5GWU0cycuxEovspdy-736x_.jpeg";
let vasl = "https://img.google-info.org/storage/big/6759229.jpg?18f864fac328b1df0ad4864f9dbbeda4=48326a35661a1d5380522f40c2f5da71";
const Main = ({id, updateLists, NewsController, tema, foxComics, startReadPlease, openUser, fetchedUser, setActiveStory, MangaController, booksComics, comicsNezavis, BACK_FROM_TIGHT, set_BACK_FROM_TIGHT, openTight}) => {
    const musicGradient = 'linear-gradient(135deg, #ADE6FF 0%, #ABE3FF 1%, #A7DCFF 3%, #A0CFFF 7%, #97BCFF 12%, #8DA4FF 19%, #8285FF 26%, #8B76FF 34%, #9C6AFF 43%, #B05FFF 52%, #C655FF 62%, #DB4CFF 71%, #EE45FF 81%, #FA41FF 91%, #FF3FFF 100%)';
    const [type, setType] = useState(null);
    const [updatedMangas, setUpdated] = useState(null);
    const [news, setNews] = useState(null)
    const [active_new, setActive_New] = useState(null)
    const [continueComics, setContinueComics] = useState(null)
    const onSwipeEnd = (e) => {

    }

    useEffect(() => {
        MangaController.getUpdatedComcis({}).then((r) => {
            setUpdated(r)
            NewsController.getNews({}).then((r) => {
                setNews(r)
            })

        })
        updateLists();

    }, [])
    useEffect(() => {
        MangaController.getContinue({}).then((r) => {
            setContinueComics(r)
        })
    }, [fetchedUser])

    const getComc = (typed) => {
        if (typed === "news") {
            NewsController.getNews({}).then((r) => {
                setNews(r)
            })
        } else {
            MangaController.getAllComics({typed: typed}).then((r) => {
                setType(r)
            })
        }

    }
    const getTimeWhen = (date) => {
        date = new Date(date)
        var seconds = Math.floor((new Date() - date) / 1000);

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
    const [activeModal, setActiveModal] = useState(null)
    const openNew = (item) => {
        setActive_New(item)
        setActiveModal("new")
    }
    const comicDivFox = memo(({index, style}) => {
        const comic = foxComics[index];
        const isNoCar = true
        let avatar;
        if (comic.avatar)
            avatar = comic.avatar.substring(2).split(' ').join("%20");
        return (
            <div style={style}>
                <Comic item={comic} name={comic.name} onClick={() => {
                    set_BACK_FROM_TIGHT("main");
                    openTight(comic)
                }} key={index} rating={comic.sredRating}
                       img={`https://foxcomics.ru${avatar}`}/>
            </div>
        )
    })
    const comicDivNezav = memo(({index, style}) => {
        const comic = comicsNezavis[index];
        const isNoCar = true
        let avatar;
        if (comic.avatar)
            avatar = comic.avatar.substring(2).split(' ').join("%20");
        return (
            <div style={style}>
                <Comic item={comic} name={comic.name} onClick={() => {
                    set_BACK_FROM_TIGHT("main");
                    openTight(comic)
                }} key={index} rating={comic.sredRating}
                       img={`https://foxcomics.ru${avatar}`}/>
            </div>
        )
    })
    const comicDivBooks = memo(({index, style}) => {
        const comic = booksComics[index];
        const isNoCar = true
        let avatar;
        if (comic.avatar)
            avatar = comic.avatar.substring(2).split(' ').join("%20");
        return (
            <div style={style}>
                <Comic item={comic} name={comic.name} onClick={() => {
                    set_BACK_FROM_TIGHT("main");
                    openTight(comic)
                }} key={index} rating={comic.sredRating}
                       img={`https://foxcomics.ru${avatar}`}/>
            </div>
        )
    })
    return (
        <View activePanel={id}
              modal={<AllComics tema={tema} openNew={openNew} NewsController={NewsController} openUser={openUser}
                                setActiveNew={setActive_New}
                                getDate={getTimeWhen} news={active_new} all_news={news} openTight={openTight}
                                type={type}
                                set_BACK_FROM_TIGHT={set_BACK_FROM_TIGHT}
                                activeModal={activeModal} setActiveModal={setActiveModal}
                                MangaController={MangaController}/>}>
            <Panel id={id}>
                <PanelHeader

                    left={<Icon28Search onClick={() => setActiveStory("search")} className="ztc"
                                        style={{marginLeft: 5}}/>}
                    separator={false}
                />
                {/*<div className="vip_back_image" style={{backgroundImage:`url(https://phonoteka.org/uploads/posts/2021-04/1618528587_55-p-krasivii-zadnii-anime-fon-55.jpg)`}}/>*/}

                {((continueComics === null) || (continueComics.length > 0)) &&
                <Group
                    separator={"hide"}
                    style={{padding: 10, paddingTop: 0, marginBottom: 35}}
                    header={
                        <Title className={"nu_Extra_Bold"} style={{marginBottom: 20}} level="1"
                               weight="semibold">Продолжить просмотр</Title>
                    }
                >

                    {continueComics && continueComics.length > 0 &&
                    <Splide className="splide_continue" options={{height: 300, arrows: false, fixedWidth: "100%"}}>
                        {/* <Gallery className={"jkjk"} bullets={"dark"}  style={{height: 300}}>*/}

                        {continueComics.map((item, key) => {


                            if (!item.manga.hasOwnProperty("text") && item.manga.glavs && item.manga.glavs.length > 0 && item.manga.glavs.length - 1 >= item.view.glav && item.manga.glavs[item.view.glav].series.length - 1 >= item.view.serias)
                                return (
                                    <SplideSlide>
                                        <Continue
                                            onClick={() => startReadPlease(item.view.glav, item.manga, item.view.serias)}
                                            glav={item.view.glav} seria={item.view.serias} manga={item.manga}
                                            name={item.manga.name}
                                            img={`https://foxcomics.ru${item.manga.avatar.substring(2).split(' ').join("%20")}`}/>
                                    </SplideSlide>
                                )
                            else if (item.manga.hasOwnProperty("text") && item.manga.glavs && item.manga.glavs.length > 0 && item.manga.glavs.length - 1 >= item.view.glav)
                                return (
                                    <SplideSlide>
                                        <Continue
                                            onClick={() => startReadPlease(item.view.glav, item.manga, item.view.serias)}
                                            glav={item.view.glav} seria={item.view.serias} manga={item.manga}
                                            name={item.manga.name}
                                            img={`https://foxcomics.ru${item.manga.avatar.substring(2).split(' ').join("%20")}`}/>
                                    </SplideSlide>
                                )
                        })}
                    </Splide>

                    }
                    {/**/}
                </Group>
                }

                <Group
                    separator={"hide"}
                    style={{padding: 10, paddingTop: 0}}
                    header={
                        <div className={"grp_header"}>
                            <Title className={"nu_Extra_Bold"} level="1" weight="semibold">Fox
                                Comics</Title>
                            {foxComics && foxComics.length > 0 &&
                            <Subhead onClick={() => {
                                getComc("fox");
                                setActiveModal("all_comics")
                            }} className={"nu_Semi_Bold"} style={{color: "#937FF5"}} weight="regular">Смотреть
                                все</Subhead>
                            }
                        </div>

                    }
                >
                    {foxComics && foxComics.length > 0 ?

                        <List
                            className={"ne_list"}
                            layout="horizontal"
                            height={280}
                            width={180}
                            itemSize={160}
                            itemCount={foxComics.length}>
                            {comicDivFox}
                        </List>



                        /*  <Gallery slideWidth="180px" style={{height: 280}}>
                              {foxComics.map((item, key) => {
                                  let avatar = item.avatar && item.avatar.substring(2).split(' ').join("%20");
                                  return (
                                      <div style={{width: 150}}>
                                          <Comic name={item.name} onClick={() => {
                                              set_BACK_FROM_TIGHT("main");
                                              openTight(item)
                                          }} key={key} rating={item.sredRating}
                                                 img={`https://foxcomics.ru${avatar}`}/>
                                      </div>

                                  )

                              })}
                          </Gallery>*/
                        :
                        <Placeholder
                            icon={<Icon56SearchLikeOutline fill={"#937FF5"}/>}
                            header={"Упс..."}
                        >
                            Ничего не найдено
                        </Placeholder>

                    }

                </Group>

                <Group
                    separator={"hide"}
                    style={{padding: 10, paddingTop: 0}}
                    header={
                        <div className={"grp_header"}>
                            <Title className={"nu_Extra_Bold"} level="1" weight="semibold">Независимые</Title>
                            <Subhead onClick={() => {
                                getComc("nezav");
                                setActiveModal("all_comics")
                            }} className={"nu_Semi_Bold"} style={{color: "#937FF5"}} weight="regular">Смотреть
                                все</Subhead>
                        </div>

                    }
                >
                    {comicsNezavis && comicsNezavis.length > 0 ?
                        <List
                            className={"ne_list"}
                            layout="horizontal"
                            height={280}
                            width={180}
                            itemSize={160}
                            itemCount={comicsNezavis.length}>
                            {comicDivNezav}
                        </List>
                        /*<Gallery slideWidth="180px" style={{height: 280}}>
                            {comicsNezavis.map((item, key) => {
                                let avatar = item.avatar ? item.avatar.substring(2).split(' ').join("%20") : "";
                                return (
                                    <div style={{width: 150}}>
                                        <Comic name={item.name} onClick={() => {
                                            set_BACK_FROM_TIGHT("main");
                                            openTight(item)
                                        }} key={key} rating={item.sredRating}
                                               img={`https://foxcomics.ru${avatar}`}/>
                                    </div>

                                )

                            })}
                        </Gallery>*/ :
                        <Placeholder
                            icon={<Icon56SearchLikeOutline fill={"#937FF5"}/>}
                            header={"Упс..."}
                        >
                            Ничего не найдено
                        </Placeholder>
                    }
                </Group>


                <Group
                    separator={"hide"}
                    style={{padding: 10, paddingTop: 0}}
                    header={
                        <div className={"grp_header"}>
                            <Title className={"nu_Extra_Bold"} level="1" weight="semibold">Книжная полка</Title>
                            {booksComics && booksComics.length > 0 &&
                            <Subhead onClick={() => {
                                getComc("books");
                                setActiveModal("all_comics")
                            }} className={"nu_Semi_Bold"} style={{color: "#937FF5"}} weight="regular">Смотреть
                                все</Subhead>
                            }
                        </div>

                    }
                >
                    {booksComics && booksComics.length > 0 ?
                        <List
                            className={"ne_list"}
                            layout="horizontal"
                            height={280}
                            width={180}
                            itemSize={160}
                            itemCount={booksComics.length}>
                            {comicDivBooks}
                        </List>
                        /*<Gallery slideWidth="45%" style={{height: 280}}>
                            {booksComics.map((item, key) => {
                                let avatar = item.avatar ? item.avatar.substring(2).split(' ').join("%20") : "";
                                return (
                                    <div style={{width: 150}}>
                                        <Comic name={item.name} onClick={() => {
                                            set_BACK_FROM_TIGHT("main");
                                            openTight(item)
                                        }} key={key} rating={item.sredRating}
                                               img={`https://foxcomics.ru${avatar}`}/>
                                    </div>

                                )

                            })}
                        </Gallery>*/
                        :
                        <Placeholder
                            icon={<Icon56SearchLikeOutline fill={"#937FF5"}/>}
                            header={"Упс..."}
                        >
                            Ничего не найдено
                        </Placeholder>

                    }

                </Group>

                {news && news.length > 0 &&
                <Group
                    separator={"hide"}
                    style={{padding: 10, paddingTop: 0, marginBottom: 35}}
                    header={
                        <div className={"grp_header"}>
                            <Title className={"nu_Extra_Bold"} level="1" weight="semibold">Статьи</Title>
                            <Subhead onClick={() => {
                                getComc("news");
                                setActiveModal("all_news")
                            }} className={"nu_Semi_Bold"} style={{color: "#937FF5"}} weight="regular">Смотреть
                                все</Subhead>
                        </div>
                    }
                >
                    <Gallery slideWidth="100%" style={{height: 280}}>
                        {news.map((item, key) => (
                            <Article
                                tema={tema}
                                onClick={() => openNew(item)}
                                views={item.views}
                                name={item.name}
                                when={getTimeWhen(item.when_created)}
                                img={`https://foxcomics.ru${item.avatar ? item.avatar.substring(2).split(' ').join("%20") : ""}`}/>
                        ))}
                    </Gallery>

                </Group>
                }

                <Group
                    separator={"hide"}
                    style={{padding: 10, paddingTop: 0, marginBottom: 35}}
                    header={
                        <div className={"grp_header"}>
                            <Title className={"nu_Extra_Bold"} level="1" weight="semibold">Присоединяйся</Title>

                        </div>
                    }
                >

                    <Gallery
                        slideWidth="250px"
                        align={"left"}
                        style={{height: 250}}

                    >
                        <Link target={"_blank"} href={link_group} style={{textAlign: "left"}}>
                            <Banner
                                className={"main_banner"}
                                mode="image"
                                style={{width: "200px", pointerEvents: "none"}}
                                before={
                                    <div>
                                        <Avatar className={"avatar_with"}><Icon28UsersOutline
                                            fill="#fff"/></Avatar>
                                        <div className="bannerInfo">
                                            <div className="chevron_fl">
                                                <Title className={"nu_Bold articleName"} level="2" weight="regular">
                                                    Наша группа
                                                </Title>
                                                <Icon24ChevronCompactRight/>
                                            </div>
                                            <Headline weight="medium" style={{marginBottom: 10, marginTop: 10}}>Последние
                                                новости
                                                касаемо приложения</Headline>
                                        </div>
                                    </div>

                                }
                                background={
                                    <div className="inGroupBack purple_gradient"/>
                                }

                            />
                        </Link>
                        <Link target={"_blank"} href={link_to_mess} style={{textAlign: "left"}}>
                            <Banner
                                className={"main_banner"}
                                mode="image"
                                style={{width: "90%", height: 200, pointerEvents: "none"}}
                                before={
                                    <div style={{height: 200}}>
                                        <Avatar className={"avatar_with"}><Icon56MessagesOutline width={28} height={28}
                                                                                                 fill="#fff"/></Avatar>
                                        <div className="bannerInfo">
                                            <div className="chevron_fl">
                                                <Title className={"nu_Bold articleName"} level="2" weight="regular">
                                                    Наша беседа
                                                </Title>
                                                <Icon24ChevronCompactRight/>
                                            </div>
                                            <Headline weight="medium" style={{marginBottom: 10, marginTop: 10}}>Ламповая
                                                компания
                                                и ответы на вопросы</Headline>
                                        </div>
                                    </div>

                                }
                                background={
                                    <div className="inGroupBack lightPurple_gradient"/>
                                }

                            />
                        </Link>
                    </Gallery>
                </Group>
                <Group
                    separator={"hide"}
                    style={{padding: 10, marginBottom: 35}}
                    header={
                        <div className={"grp_header"}>
                            <Title className={"nu_Extra_Bold"} level="1" weight="semibold">Обновления</Title>

                        </div>
                    }
                >
                    {updatedMangas && updatedMangas.length > 0 && updatedMangas.map((item, key) => {
                        if (item.glavs.length > 0)
                            return (
                                <Updates item={item} onClick={() => {
                                    set_BACK_FROM_TIGHT("main");
                                    openTight(item)
                                }}
                                         img={`https://foxcomics.ru${item.avatar && item.avatar.substring(2).split(' ').join("%20")}`}
                                         rating={item.sredRating} name={item.name}
                                         time={getTimeWhen(new Date(item.last_update))}
                                         tom={
                                             item.hasOwnProperty("text") && item.text ? `Глава ${item.glavs.length}` : `Глава ${item.glavs.length}`
                                         }
                                />
                            )
                    })
                    }
                    {updatedMangas && updatedMangas.length > 0 &&
                    <CellButton onClick={() => {
                        getComc("updated");
                        setActiveModal("all_comics")
                    }} className={"nu_Semi_Bold"} style={{color: "#937FF5"}}>
                        Смотреть
                        все
                    </CellButton>

                    }
                </Group>
            </Panel>
        </View>

    )
}

export default Main;