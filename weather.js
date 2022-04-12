#!/usr/bin/env node

import { getArgs } from "./helpers/args.js";
import { getIcon, getWeather } from './services/api.service.js';
import { printError, printHelp, printSuccess, printWeather } from "./services/log.service.js";
import { getKeyValue, saveKeyValue, TOKEN_DICTIONARY } from "./services/storage.service.js";

const saveToken = async (token) => {
    if (!token.length) {
        printError('Не передан токен')
        return
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.token, token)
        printSuccess('Токен сохранён')
    } catch (error) {
        printError(error.message)
    }
}

const saveCity = async (city) => {
    if (!city.length) {
        printError('Не передан город')
        return
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.city, city)
        printSuccess('Город сохранён')
    } catch (error) {
        printError(error.message)
    }
}

const getForCast = async () => {
    try {
        const city = await getKeyValue(TOKEN_DICTIONARY.city)
        if (city) {
            const weather = await getWeather(city)
            const icon = getIcon(weather.weather[0].icon)
            printWeather(weather, icon)
        } else {
            printError('Не задан город, задайте его через команду -s [CITY]')
        }
    } catch (e) {
        if (e?.response?.status === 404) {
            printError('Неверно указан город')
        } else if (e?.response?.status === 401) {
            printError('Неверно указан токен')
        } else {
            printError(e.message)
        }
    }
}

const initCLI = () => {
    const args = getArgs(process.argv)
    if (args.h) {
        // вывести help
        return printHelp()
    }
    if (args.s) {
        // сохранить город
        return saveCity(args.s)
    }
    if (args.t) {
        // сохранить token
        return saveToken(args.t)
    }
    // вывести погоду
    return getForCast()
}

initCLI()