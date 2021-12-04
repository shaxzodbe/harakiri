import React, {useEffect, useState} from "react";
import {Badge, Button, Headline, IconButton, SimpleCell, Subhead, Title} from "@vkontakte/vkui";
import {Icon28NotificationDisableOutline} from '@vkontakte/icons';

const Updates = ({name, tom, rating,item, onClick, time, img}) => {
    return (
        <SimpleCell onClick={onClick}>
            <div className="updateDiv">
                <div style={{backgroundImage: `url(${img})`}} className="imgUpdate"/>
                <div className="update_info">

                    <div className={"badje_info"}>

                        <Title style={{fontSize:16}} className={"nu_Bold static_widthTitle articleName margin15 nameUpdate"} level="2"
                               weight="regular">{name}</Title>


                    </div>

                    <div className={"margin15"}>
                        <Subhead style={{fontSize:13}} className={"nu_Semi_Bold articleName"} level="3" weight="regular">{tom}</Subhead>

                    </div>

                    {rating !== null && String(rating) !== "undefined" &&
                    <div className="updateRating">

                        <div className={`nu_Bold update_rating ${rating > 7 ? "good_r" : rating <= 5 ? "bad_r" : "sred_r"}`}>{rating.toFixed(1)}</div>




                        <Subhead weight="regular" style={{color: "#99A2AD",fontSize:12}}>{time}</Subhead>
                    </div>
                    }

                </div>
                {/*{!rating && rating !== 0 &&

                <IconButton>
                    <Button mode="tertiary" className={"thisIS"}
                            before={<Icon28NotificationDisableOutline fill={"rgba(115,92,230,1)"}/>}/>
                </IconButton>


                }*/}

            </div>
        </SimpleCell>

    )
}
export default Updates;