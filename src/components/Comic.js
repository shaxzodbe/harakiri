import React, {useState,useEffect,memo} from "react";
import {Title} from "@vkontakte/vkui";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Icon20BookOutline } from '@vkontakte/icons';
const Comic =({img,rating,name = "Поднятия уровня в одиночку",onClick,isNoCar = true,item}) => {

    return (
        <div onClick={onClick} className={"comic_div"}>
            <LazyLoadImage
                alt={name}
                effect="blur"
                threshold={1000}
                className={"back_of_car_c"}
                src={img} // use normal <img> attributes as props
                 />
           {/* <div style={{backgroundImage: `url(${img})`}} className="back_of_car_c"/>*/}
            <Title  className={"nu_Bold comicName"} level="3" weight="regular">{name.length > 25 ? `${name.substring(0,25)}...` : name}</Title>
            <div className={`nu_Bold ${isNoCar ? "comic_rating" : "rerererere"} ${rating > 7 ? "good_r" : rating <= 5 ? "bad_r" : "sred_r"}`}>{rating.toFixed(1)}</div>
            {item && item.hasOwnProperty("text") &&
                <div className={"book"}>
                    <Icon20BookOutline width={17} height={17} fill={"white"}/>
                </div>

            }
        </div>
    )
}
export default Comic;