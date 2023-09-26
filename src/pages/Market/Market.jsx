import BackGround from "../../components/Wrapper/BackGround/BackGround";
import Container from "../../components/Wrapper/Container/Container";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSliders} from "@fortawesome/free-solid-svg-icons";
import Select from "../../components/Inputs/Select/Select";
import useWindowDimensions from "../../components/hooks/useWindowDimensions";

import Slider from "rc-slider";

import 'rc-slider/assets/index.css';

import styles from "./Market.module.scss"
import "./SliderStyles.css"

import {fetchGet} from "../../utils/Axios/axiosFunctions";
import LoadingBlock from "../../components/Loading/LoadingBlock/LoadingBlock";
import CenterWrapper from "../../components/Wrapper/CenterWrapper/CenterWrapper";
import {useForm} from "react-hook-form";
import {useSearchParams} from "react-router-dom";
import ProductCard from "../../components/Card/ProductCatd/ProductCard";
import {setDataToSearchParams} from "../../utils/SearchPages";

function Market(props) {
    const innerWidth = useWindowDimensions().width;
    const [isLoading, setIsLoading] = useState(false);

    const [isFiltersSelected, setIsFiltersSelected] = useState(false);

    const [isFreeEnabled, setIsFreeEnabled] = useState(false);

    const [productsTypesWithPrice, setProductsTypesWithPrice] = useState(null);

    const [range, setRange] = useState(null);
    const [marks, setMarks] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState([]);

    const [findMessage, setFindMessage] = useState("Use filters and inputs to search for products.");


    const {
        register,
        setValue,
        reset,
        watch,
        handleSubmit,
    } = useForm({
        mode: "onChange",
    })


    const currentMaxPrice = watch("currentMaxPrice");
    const currentMinPrice = watch("currentMinPrice");
    const selectedType = watch("selectedType");
    const title = watch("title");
    const code = watch("code");

    const onSubmit = async (data) => {
        const {currentMinPrice, selectedType, currentMaxPrice, ...dataForSent} = data
        setDataToSearchParams(dataForSent, searchParams, setSearchParams);
        await find();
    }
    const find = async () => {

        checkPrice();
        const searchParamsObject = Object.fromEntries(searchParams);

        const response = await fetchGet(`/products?${new URLSearchParams(searchParamsObject)}`);

        if (response.data.products) {
            setProducts(response.data.products);
            setFindMessage("Not found.")
            return;
        }
        setFindMessage("Not found.")
        setProducts([]);
    }
    const checkPrice = () => {
        if (!range?.min || !range?.max) {
            return;
        }
        if (currentMaxPrice > range.max) {
            setValue("currentMaxPrice", range.max);
        }
        if (currentMinPrice < range.min) {
            setValue("currentMinPrice", range.min);
        }

        if (currentMaxPrice < currentMinPrice) {
            setValue("currentMaxPrice", currentMinPrice);
            setValue("currentMinPrice", currentMaxPrice);
        }
        setParams(currentMinPrice, "minPrice");
        setParams(currentMaxPrice, "maxPrice");
    }
    const setParams = (value, field) => {
        if (searchParams.has(field)) {
            searchParams.set(field, value);
        } else {
            searchParams.append(field, value);
        }
        setSearchParams(searchParams);
    }
    const handleSliderChange = (values) => {
        const [min, max] = values;

        if (min === max) {
            return;
        }

        setValue("currentMinPrice", min)
        setValue("currentMaxPrice", max)

    }
    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setValue("selectedType", selectedValue);

        if (searchParams.has("productsType")) {
            searchParams.set("productsType", selectedValue);
        } else {
            searchParams.append("productsType", selectedValue);
        }
        setSearchParams(searchParams);
    }

    useEffect(() => {
        const getProductsTypesWithPrice = async () => {
            const response = await fetchGet("/products/typesWithPrice")
            const categoryWithPrice = response.data.categoryWithPrice;


            setProductsTypesWithPrice(categoryWithPrice);

            const selectedType =  searchParams.has("productsType") ? searchParams.get("productsType") : "All"
            const {minPrice, maxPrice} = categoryWithPrice.find(category => category.name === selectedType)

            reset({
                selectedType: selectedType,
                currentMinPrice: searchParams.has("minPrice") ? searchParams.get("minPrice") : minPrice,
                currentMaxPrice: searchParams.has("maxPrice") ? searchParams.get("maxPrice") : maxPrice,
                title: searchParams.has("title") ? searchParams.get("title") : "",
                code: searchParams.has("code") ? searchParams.get("code") : "",
            })

            setIsFreeEnabled(minPrice !== 0);


            const average = (minPrice + maxPrice) / 2;

            setMarks({
                [minPrice]: minPrice,
                [average]: average,
                [maxPrice]: maxPrice,
            })

            setRange({
                min: minPrice,
                max: maxPrice,
            });

            if (searchParams.size) {
                await find()
            }

            setIsLoading(true);
        }
        getProductsTypesWithPrice();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            return;
        }

        const selectedCategory = productsTypesWithPrice.find(product => product.name === selectedType);

        setRange({
            max: selectedCategory.maxPrice,
            min: selectedCategory.minPrice,
        });

        setValue("currentMaxPrice", range.max);
        setValue("currentMinPrice", range.min);

        setIsFreeEnabled(range.min !== 0);

        const average = (range.min + range.max) / 2;

        setMarks({
            [range.min]: range.min,
            [average]: average,
            [range.max]: range.max,
        })

        setParams(selectedType, "productsType");

    }, [selectedType]);

    useEffect(() => {
        if (!currentMinPrice && currentMinPrice !== 0) return;
        setParams(currentMinPrice, "minPrice");
    }, [currentMinPrice]);

    useEffect(() => {
        if (!currentMaxPrice) return;
        setParams(currentMaxPrice, "maxPrice");
    }, [currentMaxPrice]);

    useEffect(() => {
        const search = async () => {
            await searchForInput(title, "title");
        }

        search();

    }, [title]);

    useEffect(() => {
        const search = async () => {
            await searchForInput(code, "code");
        }

        search();

    }, [code]);

    const searchForInput = async (value, field) => {
        if (!value) return;
        if (value.length === 0) {
            if (searchParams.has(field)) {
                searchParams.delete(field);
                setSearchParams(searchParams);
            }
            setProducts([]);
            return;
        }
        setParams(value, field);
        await find();
    }


    if (!isLoading) {
        return <BackGround background={"linear-gradient(270deg, #8BC6EC 0%, #9599E2 100%)"}>
            <Container>
                <CenterWrapper>
                    <LoadingBlock className={"h-24 w-24"}/>
                </CenterWrapper>
            </Container>
        </BackGround>
    }


    return (
        <BackGround background={"linear-gradient(270deg, #8BC6EC 0%, #9599E2 100%)"}>
            <Container>
                <div className={styles.wrap}>
                    <form className={"rounded-t-lg flex border-b border-gray-400"} onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.filterBlock}>
                            <button className={`${styles.filterButton} ${isFiltersSelected && styles.selected}`}
                                    type={"button"}
                                    onClick={() => setIsFiltersSelected(!isFiltersSelected)}
                            >
                                {
                                    innerWidth > 500 ?
                                        <span>Filters</span>
                                        :
                                        <FontAwesomeIcon icon={faSliders}/>
                                }
                            </button>
                            <div className={`${styles.filters}  ${isFiltersSelected ? "flex" : `hidden`}`}>
                                <div className={"p-3"}>
                                    <div className={styles.filtersBlock}>
                                        <h3 className={"text-lg text-center font-bold"}>Category</h3>
                                        <Select
                                            onChange={handleSelectChange}
                                            value={selectedType}
                                        >
                                            {productsTypesWithPrice.map((product, index) => (
                                                <option key={index}>
                                                    {product.name}
                                                </option>
                                            ))
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <div className={"p-3"}>
                                    <div className={styles.filtersBlock}>
                                        <h3 className={"text-lg text-center font-bold"}>Price</h3>
                                        <div className={"px-4"}>
                                            <Slider className={"customSlider"}
                                                    range={true}
                                                    min={range.min} max={range.max}
                                                    value={[currentMinPrice, currentMaxPrice]}
                                                    onChange={handleSliderChange}
                                                    marks={marks}
                                            />
                                        </div>
                                        <div className={"flex justify-around"}>
                                            <div className={"flex flex-col items-center flex-1"}>
                                                <span>Min</span>
                                                <input type="number"
                                                       className={"border border-gray-400 rounded-lg p-2 w-[80px]"}
                                                       {...register("currentMinPrice")}
                                                />
                                            </div>
                                            <div className={"flex flex-col items-center flex-1"}>
                                                <span>Max</span>
                                                <input type="number"
                                                       className={"border border-gray-400 rounded-lg p-2 w-[80px]"}
                                                       {...register("currentMaxPrice")}

                                                />
                                            </div>
                                        </div>
                                        <div className={"flex justify-around items-center mt-3"}>
                                            <div className={"flex items-center justify-center"}>
                                                <label>
                                                    <input type={"radio"}
                                                           value={"mostExpensive"}
                                                           defaultChecked={true}
                                                           {...register("priceFilter")}
                                                    />
                                                    <span className={"ml-2"}>Expensive</span>
                                                </label>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <label>
                                                    <input type={"radio"}
                                                           value={"mostCheaper"}
                                                           {...register("priceFilter")}
                                                    />
                                                    <span className={"ml-2"}>Cheaper</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className={"flex items-center justify-center w-full mt-1"}>
                                            <label>
                                                <input type="radio" className={"cursor-pointer disabled:cursor-default"}
                                                       value={"free"} disabled={isFreeEnabled}
                                                       {...register("priceFilter")}
                                                />
                                                <span className={"ml-2 "}>
                                                    Free
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className={"p-3"}>
                                    <div className={styles.filtersBlock}>
                                        <h3 className={"text-center font-bold text-lg"}>
                                            Params
                                        </h3>
                                        <div className={"flex flex-col mt-2"}>
                                            <div className={"flex justify-around items-center"}>
                                                <label>
                                                    <input type="radio"
                                                           value={"mostLikes"}
                                                           {...register("filter")}
                                                           defaultChecked={true}
                                                    />
                                                    <span className={"ml-1"}>Most liked</span>
                                                </label>
                                                <label>
                                                    <input type="radio"
                                                           value={"mostViews"}
                                                           {...register("filter")}
                                                    />
                                                    <span className={"ml-1"}>Most views</span>
                                                </label>
                                            </div>
                                            <div className={"flex justify-around items-center mt-1"}>
                                                <label>
                                                    <input type="radio"
                                                           value={"mostOld"}
                                                           {...register("filter")}
                                                    />
                                                    <span className={"ml-1"}>Most old</span>
                                                </label>
                                                <label>
                                                    <input type="radio"
                                                           value={"mostNew"}
                                                           {...register("filter")}
                                                    />
                                                    <span className={"ml-1"}>Most new</span>
                                                </label>
                                            </div>
                                            <hr className={"my-3 mt-5 bg-gray-400 h-0.5"}/>
                                            <div className={"flex justify-center"}>
                                                <button type={"submit"}
                                                        className={"py-3 px-10 text-center bg-blue-500 rounded-lg text-white cursor-pointer transition-colors hover:bg-blue-600 hover:text-slate-100"}>
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input className={styles.nameInput}
                               placeholder={"I search..."}
                               maxLength={40}
                               {...register("title")}
                        />
                        <input className={styles.codeInput}
                               placeholder={"Code*"}
                               maxLength={6}
                               {...register("code")}
                        />
                    </form>
                    <div className={styles.productWrap}>
                        {products.length > 0
                            ?
                            products.map(product => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    isImageNeedDecoding={true}
                                />
                            ))
                            :
                            <CenterWrapper>
                                <h1 className={"text-2xl text-gray-500"}>{findMessage}</h1>
                            </CenterWrapper>
                        }
                    </div>
                </div>
            </Container>
        </BackGround>
    );
}

export default Market;