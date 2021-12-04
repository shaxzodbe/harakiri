import React, {useState, useEffect} from "react";
import {Title, Subhead} from "@vkontakte/vkui";
import {Icon16ViewOutline} from '@vkontakte/icons';
import Helper from "./Helper";

const Article = ({img,tema,style, name, when, onClick, views}) => {
    return (
        <div style={{...style}} onClick={onClick} className={"comic_div"}>

            <div style={{backgroundImage: `url('${img}')`}} className="back_of_car_c"/>
            <div className={"article_info"}>
                <Subhead weight="regular" style={{color: "#99A2AD"}}>{when}</Subhead>
                <div className="viewv_div">
                    <Icon16ViewOutline style={{marginRight: 5}} className={Helper.getColorForTheme(tema)}/>
                    <Subhead className={"nu_Semi_Bold articleName"} level="3" weight="regular">{views}</Subhead>
                </div>
            </div>
            <Title style={{fontSize:18}} className={"nu_Bold articleName"} level="3" weight="regular">{name}</Title>

        </div>
    )
}
export default Article;