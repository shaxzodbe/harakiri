import React,{useRef,useEffect,useState} from "react";
import {
    Title,Gallery,Group
} from "@vkontakte/vkui"
import {Carousel} from "react-responsive-carousel";
import $ from "jquery"
import { Splide, SplideSlide } from '@splidejs/react-splide';
const SwipeRating = ({slideIndex,setIndex}) => {
    const galleryRef =  useRef();

    useEffect(()=>{
    },[galleryRef])
    const  dragEnd = (e) =>{



        let start = e.startX;
        let end = e.shiftXAbs+10;
        if(isNaN(end))
            return  false;
        let slideIndex2 = slideIndex;
        if(end < start){
            if(slideIndex < 9) {
                setIndex(prevState => prevState + 1)
                slideIndex2+=1;
            }
        }else
            if(slideIndex !== 0) {
                setIndex(prevState => prevState - 1)
                slideIndex2-=1;
            }
       editClasses(slideIndex2)
    }
    useEffect(()=>{
        let slideIndex2 = slideIndex;
        let all_children = $(".gallery_destroy").find(".vkuiGallery__layer.Gallery__layer").children()
        clearClass(all_children);
        if(slideIndex2 === 0){
            for(let i = 0; i < all_children.length;i++){
                if(i === slideIndex2 + 1){
                    $(all_children[i]).addClass("rating_mini")
                }else if(i > slideIndex2 +1){
                    $(all_children[i]).addClass("rating_mini2")
                }
            }
        }
    },[])
    const editClasses = (slideIndex2) =>{
        let all_children = $(".gallery_destroy").find(".vkuiGallery__layer.Gallery__layer").children()
        clearClass(all_children);
        if(slideIndex2 === 0){
            for(let i = 0; i < all_children.length;i++){
                if(i === slideIndex2 + 1){
                    $(all_children[i]).addClass("rating_mini")
                }else if(i > slideIndex2 +1){
                    $(all_children[i]).addClass("rating_mini2")
                }
            }
        }else if(slideIndex2 === 9){
            for(let i = 9; i > -1;i--){

                /*if(i === slideIndex){

                }else*/ if(i === slideIndex2 - 1){
                    $(all_children[i]).addClass("rating_mini")
                }else if(i < slideIndex2 -1){
                    $(all_children[i]).addClass("rating_mini2")
                }
            }
        }else{
            for(let i = 0; i < all_children.length;i++){
                if(i === slideIndex2){
                    $(all_children[i+1]).addClass("rating_mini")
                    $(all_children[i-1]).addClass("rating_mini")
                }else if(i > slideIndex2 + 1){
                    $(all_children[i]).addClass("rating_mini2")
                }else if (i < slideIndex2 - 1){
                    $(all_children[i]).addClass("rating_mini2")
                }
            }
        }
    }
    const clearClass = (map) =>{
        for(let i = 0; i < map.length;i++){
            $(map[i]).removeClass("rating_mini")
            $(map[i]).removeClass("rating_mini2")
        }
    }
    const click = (e) =>{
        let id = parseInt(e.currentTarget.dataset.id)
        setIndex(id)
        editClasses(id)
    }
    return (

            <Group >
                <Gallery
                    className={"gallery_destroy"}
                    slideIndex={slideIndex}
                    onDragEnd={dragEnd}
                    getRef={galleryRef}
                    slideWidth="22%"
                    align="center"
                    style={{ height: 150 }}
                >
                    <div onClick={click} data-id={0} className="rating_div_circle r1">
                        <Title className={"nu_Bold swp_h1"} level={2} weight={"regular"}>1</Title>
                    </div>

                    <div onClick={click} data-id={1} className="rating_div_circle r2">
                        <Title className={"nu_Bold swp_h1"} level={2} weight={"regular"}>2</Title></div>

                    <div onClick={click} data-id={2} className="rating_div_circle r3">
                        <Title className={"nu_Bold swp_h1"} level={2} weight={"regular"}>3</Title></div>

                    <div onClick={click} data-id={3} className="rating_div_circle r4">
                        <Title className={"nu_Bold swp_h1"} level={2} weight={"regular"}>4</Title></div>

                    <div onClick={click} data-id={4} className="rating_div_circle r5">
                        <Title className={"nu_Bold swp_h1"} level={2} weight={"regular"}>5</Title></div>

                    <div onClick={click} data-id={5} className="rating_div_circle r6">
                        <Title className={"nu_Bold swp_h1"} level={2} weight={"regular"}>6</Title></div>

                    <div onClick={click} data-id={6} className="rating_div_circle r7">
                        <Title className={"nu_Bold swp_h1"} level={2} weight={"regular"}>7</Title></div>

                    <div onClick={click} data-id={7} className="rating_div_circle r8">
                        <Title className={"nu_Bold swp_h1"} level={2} weight={"regular"}>8</Title></div>

                    <div onClick={click} data-id={8} className="rating_div_circle r9">
                        <Title className={"nu_Bold swp_h1"} level={2} weight={"regular"}>9</Title></div>

                    <div onClick={click} data-id={9} className="rating_div_circle r10">
                        <Title className={"nu_Bold swp_h1"} level={2} weight={"regular"}>10</Title></div>
                </Gallery>
            </Group>







    )
}
export default SwipeRating;