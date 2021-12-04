import React, {useEffect} from "react";
import {Title} from "@vkontakte/vkui";
import Img from 'react-optimized-image';

const Continue = ({img, name, onClick, seria, glav, manga}) => {
    useEffect(() => {
       if(!manga.glavs[glav].path)
           manga.glavs[glav].path = manga.path;
    }, [])

    return (
        <div onClick={onClick} className="carousel_div continue_div">

            <div style={{backgroundImage: `url(${img})`}} className="back_of_car back_of_car_cont"/>
            <div className={"continue_info"}>
                <Title style={{alignSelf: "start", justifySelf: "start", paddingLeft: 10}} className={"nu_Bold "}
                       level="2"
                       weight="regular">{name.length > 10 ? name.substring(0, 10) + "..." : name}</Title>

                {!manga.hasOwnProperty("text")  ?

                    <div
                        style={{
                            backgroundImage: `url('https://foxcomics.ru${manga.glavs[glav].hasOwnProperty("path") ? manga.glavs[glav].path : manga.path}/photos/${manga.glavs[glav].series[seria]}`
                        }}
                        className="contrinImg"/> :
                    <div className="contrinImg">
                        <Title className={`tight_title nu_Extra_Bold`} level={2}
                               weight>{manga.glavs[glav].name}</Title>
                        <Title
                            style={{height: "85%"}}
                            className={`tight_title all_text_text nu_Bold`} level={3}
                            weight dangerouslySetInnerHTML={{__html:manga.glavs[glav].text}}/>
                    </div>
                }


                <div className="continue_detail">
                    <Title className={"nu_Bold "} level="3"
                           weight="regular">Глава {glav + 1}</Title>
                    {!manga.hasOwnProperty("text") &&
                    <Title className={"nu_Bold "} level="3"
                           weight="regular">{seria + 1} стр</Title>
                    }
                </div>
            </div>

        </div>
    )
}
export default Continue;