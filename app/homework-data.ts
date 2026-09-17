export const homeworkWords = [
 {word:"deal",ru:"сделка",ipa:"/diːl/",en:"We made a deal with the hotel.",example:"Мы заключили сделку с отелем."},
 {word:"camera",ru:"фотоаппарат",ipa:"/ˈkæmərə/",en:"I took a photo with my camera.",example:"Я сделал снимок своим фотоаппаратом."},
 {word:"ticket",ru:"билет",ipa:"/ˈtɪkɪt/",en:"Can I buy a train ticket here?",example:"Можно купить здесь билет на поезд?"},
 {word:"luggage",ru:"багаж",ipa:"/ˈlʌɡɪdʒ/",en:"My luggage is very heavy.",example:"Мой багаж очень тяжёлый."},
 {word:"passport",ru:"паспорт",ipa:"/ˈpɑːspɔːt/",en:"Please show me your passport.",example:"Пожалуйста, покажите ваш паспорт."},
 {word:"journey",ru:"путешествие",ipa:"/ˈdʒɜːni/",en:"The journey took three hours.",example:"Путешествие заняло три часа."},
 {word:"airport",ru:"аэропорт",ipa:"/ˈeəpɔːt/",en:"We arrived at the airport early.",example:"Мы приехали в аэропорт рано."},
 {word:"hotel",ru:"отель",ipa:"/həʊˈtel/",en:"Our hotel is near the beach.",example:"Наш отель находится рядом с пляжем."},
 {word:"key",ru:"ключ",ipa:"/kiː/",en:"I cannot find my room key.",example:"Я не могу найти ключ от номера."},
 {word:"map",ru:"карта",ipa:"/mæp/",en:"Let us look at the map.",example:"Давай посмотрим на карту."},
 {word:"coffee",ru:"кофе",ipa:"/ˈkɒfi/",en:"I would like a cup of coffee.",example:"Я хотел бы чашку кофе."},
 {word:"meal",ru:"приём пищи",ipa:"/miːl/",en:"Breakfast is my favourite meal.",example:"Завтрак — мой любимый приём пищи."},
 {word:"bicycle",ru:"велосипед",ipa:"/ˈbaɪsɪkl/",en:"We explored the city by bicycle.",example:"Мы исследовали город на велосипеде."},
 {word:"umbrella",ru:"зонт",ipa:"/ʌmˈbrelə/",en:"Take an umbrella; it might rain.",example:"Возьми зонт: может пойти дождь."},
 {word:"wallet",ru:"кошелёк",ipa:"/ˈwɒlɪt/",en:"My ticket is inside my wallet.",example:"Мой билет лежит в кошельке."}
].map((w,image)=>({...w,image,pos:"noun · существительное"}));
export const homeworkStages=["Изучение","Написание","Перевод","Речь и картинки"];
export type HomeworkState={stage:number;index:number;mistakes:number;skipped:number;revision:number};
export const initialHomework:HomeworkState={stage:0,index:0,mistakes:0,skipped:0,revision:0};
export function wordOptions(index:number){return [index,(index+3)%15,(index+7)%15,(index+11)%15].sort((a,b)=>((a*7+index*3)%17)-((b*7+index*3)%17));}
export function normalizeWord(value:string){return value.toLowerCase().trim().replace(/[.,!?;:]/g,"");}
