// data/index.js
// Ветхий Завет
import { genesis } from './old-testament/genesis.js';
import { exodus } from './old-testament/exodus.js';
import { psalms } from './old-testament/psalms.js';

// Новый Завет
import { matthew } from './new-testament/matthew.js';
import { john } from './new-testament/john.js';
import { revelation } from './new-testament/revelation.js';

// Евангелие Маркиона
import { gospelOfLord } from './marcion-gospel/gospel-of-lord.js';

// Апостоликон Маркиона
import { galatiansMarcion } from './apostolikon/galatians-marcion.js';

// Наг-Хаммади
import {prayerOfPaul} from './nag-hammadi/prayer-of-paul';
import { gospelOfThomas } from './nag-hammadi/gospel-of-thomas.js';
import { apocryphonOfJohn } from './nag-hammadi/apocryphon-of-jphn';

// Другие тексты
import { gospelOfMary } from './other/gospel-of-mary.js';
import { gospelOfJudas } from './other/gospel-of-judas.js';

// Собираем все книги в один массив
export const books = [
    // Ветхий Завет
    genesis,
    exodus,
    psalms,

    // Новый Завет
    matthew,
    john,
    revelation,

    // Евангелие Маркиона
    gospelOfLord,

    // Апостоликон Маркиона
    galatiansMarcion,

    // Наг-Хаммади
    prayerOfPaul,
    gospelOfThomas,
    apocryphonOfJohn,

    // Другие тексты
    gospelOfMary,
    gospelOfJudas
];

// Экспортируем отдельные книги для возможного использования
export {
    // Ветхий Завет
    genesis,
    exodus,
    psalms,

    // Новый Завет
    matthew,
    john,
    revelation,

    // Евангелие Маркиона
    gospelOfLord,

    // Апостоликон Маркиона
    galatiansMarcion,

    // Наг-Хаммади
    gospelOfThomas,

    // Другие тексты
    gospelOfMary,
    gospelOfJudas
};