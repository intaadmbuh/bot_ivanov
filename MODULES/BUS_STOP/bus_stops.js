function BusStop(name, lat, lng, ref, radius=20){
	this.name = name;
	this.lat = lat;
	this.lng = lng;
	this.ref = ref;
	this.radius = radius;
}
//север/юг это относительно географического положения в яндекс картах
let busStops = [
		new BusStop("ул. Морозова (конечная)",66.033798, 60.086133, 'https://yandex.ru/maps/10941/inta/stops/1543152071/',15),
		new BusStop("ул. Морозова (начальная)",66.033702, 60.086930,'https://yandex.ru/maps/10941/inta/stops/1543152069/',15),
		new BusStop("ул. Мира (север)",66.035474, 60.095152,'https://yandex.ru/maps/10941/inta/stops/1543152032/'),
		new BusStop("ул. Мира (юг)",66.035543, 60.096741,'https://yandex.ru/maps/10941/inta/stops/1543152027/'),
		new BusStop("Роддом (север)",66.037462, 60.106827,'https://yandex.ru/maps/10941/inta/stops/1543151992/'),
		new BusStop("Роддом (юг)",66.036888, 60.104244,'https://yandex.ru/maps/10941/inta/stops/1543151998/'),
		new BusStop("Политех (север)",66.039445, 60.117386,'https://yandex.ru/maps/10941/inta/stops/1543151947/'),
		new BusStop("Политех (юг)",66.039155, 60.116618,'https://yandex.ru/maps/10941/inta/stops/1543151951/'),
		new BusStop("Детская поликлиника (север)",66.040819, 60.124880,'https://yandex.ru/maps/10941/inta/stops/1543151908/'),
		new BusStop("Детская поликлиника (юг)",66.040807, 60.125450,'https://yandex.ru/maps/10941/inta/stops/1543151906/'),
		new BusStop("пл. Комсомольская площадь (север)",66.039922, 60.130843,'https://yandex.ru/maps/10941/inta/stops/1543151877/',30),
		new BusStop("пл. Комсомольская площадь (юг)",66.039490, 60.131730,'https://yandex.ru/maps/10941/inta/stops/1543151875/',30),

		new BusStop("ул. Воркутинская",66.034645, 60.103125,'https://yandex.ru/maps/10941/inta/stops/1543152003/'),

		new BusStop("мкр. Западный (конечная)",66.025832, 60.069574,'https://yandex.ru/maps/10941/inta/stops/1543152136/'),
		new BusStop("мкр. Западный (начальная)",66.025659, 60.070156,'https://yandex.ru/maps/10941/inta/stops/1543152133/'),
		new BusStop("ул. Новая (север)",66.027503, 60.078569,'https://yandex.ru/maps/10941/inta/stops/1543152116/'),
		new BusStop("ул. Новая (юг)",66.027725, 60.080470,'https://yandex.ru/maps/10941/inta/stops/1543152106/'),
		new BusStop("ул. Морозова (север)",66.029404, 60.088251,'https://yandex.ru/maps/10941/inta/stops/1543152064/'),
		new BusStop("ул. Морозова (юг)",66.029478, 60.089781,'https://yandex.ru/maps/10941/inta/stops/1543152061/'),

		new BusStop("Рынок",66.030899, 60.095464,'https://yandex.ru/maps/10941/inta/stops/1543152031/'),

		new BusStop("Детский мир (север)",66.031603, 60.100042,'https://yandex.ru/maps/10941/inta/stops/1543151992/'),
		new BusStop("Детский мир (юг)",66.031603, 60.101294,'https://yandex.ru/maps/10941/inta/stops/1543152016/'),
		new BusStop("ул. Куратова (север)",66.033141, 60.108140,'https://yandex.ru/maps/10941/inta/stops/1543151979/'),
		new BusStop("ул. Куратова (юг)",66.033436, 60.110891,'https://yandex.ru/maps/10941/inta/stops/1543151975/'),
		new BusStop("ДОСААФ (север)",66.034740, 60.116900,'https://yandex.ru/maps/10941/inta/stops/1543151948/',15),
		new BusStop("ДОСААФ (юг)",66.034437, 60.116139,'https://yandex.ru/maps/10941/inta/stops/1543151952/',15),
		new BusStop("Дом быта (север)",66.035915, 60.123443,'https://yandex.ru/maps/10941/inta/stops/1543151913/'),
		new BusStop("Дом быта (юг)",66.035915, 60.123443,'https://yandex.ru/maps/10941/inta/stops/1543151907/'),

		new BusStop("Стадион (север)",66.039830, 60.141681,'https://yandex.ru/maps/10941/inta/stops/1543151832/',15),
		new BusStop("Стадион (юг)",66.039639, 60.141160,'https://yandex.ru/maps/10941/inta/stops/1543151835/',15),
		new BusStop("Дом культуры (север)",66.039988, 60.152704,'https://yandex.ru/maps/10941/inta/stops/1543151801/'),
		new BusStop("Дом культуры (юг)",66.039988, 60.152704,'https://yandex.ru/maps/10941/inta/stops/1543151814/'),
		new BusStop("Завод ЖБИ (север)",66.040092, 60.165858,'https://yandex.ru/maps/10941/inta/stops/1543151770/',15),
		new BusStop("Завод ЖБИ (юг)",66.040092, 60.165858,'https://yandex.ru/maps/10941/inta/stops/1543151767/',15),
		new BusStop("Горка (восток)",66.040822, 60.177292,'https://yandex.ru/maps/10941/inta/stops/1543151742/',15),
		new BusStop("Горка (север)",66.040347, 60.176136,'https://yandex.ru/maps/10941/inta/stops/1543151747/',15),
		new BusStop("Горка (юг)",66.039795, 60.176720,'https://yandex.ru/maps/10941/inta/stops/1543151744/',15),

		new BusStop("Шахта Капитальная (север)",66.044026, 60.181633,'https://yandex.ru/maps/10941/inta/stops/1543151722/',10),
		new BusStop("Шахта Капитальная (юг)",66.044026, 60.181617,'https://yandex.ru/maps/10941/inta/stops/1543151723/',10),
		new BusStop("Интанефть (север)",66.048171, 60.187850,'https://yandex.ru/maps/10941/inta/stops/3748654480/',15),
		new BusStop("Интанефть (юг)",66.047998, 60.188018,'https://yandex.ru/maps/10941/inta/stops/3748654550/',15),
		new BusStop("дк. Восток (север)",66.050792, 60.191658,'https://yandex.ru/maps/10941/inta/stops/1543151680/'),
		new BusStop("дк. Восток (юг)",66.050302, 60.191669,'https://yandex.ru/maps/10941/inta/stops/1543151677/'),

		new BusStop("Школа №2 (север)",66.052522, 60.194805,'https://yandex.ru/maps/10941/inta/stops/3748809010/',12),
		new BusStop("Школа №2 (юг)",66.052862, 60.195878,'https://yandex.ru/maps/10941/inta/stops/3748808760/',12),

		new BusStop("Шахтная 30б",66.056166, 60.217702,'https://yandex.ru/maps/10941/inta/stops/3748656010/',100),

		new BusStop("мкр. Восточный (конечная)",66.058253, 60.228748,'https://yandex.ru/maps/10941/inta/stops/3748656010/',100),

		new BusStop("ул. Деповская (запад)",66.033546, 60.179745,'https://yandex.ru/maps/10941/inta/stops/3748784130/'),
		new BusStop("ул. Деповская (восток)",66.034033, 60.179971,'https://yandex.ru/maps/10941/inta/stops/3748784020/'),
		new BusStop("ул. Доковская (запад)",66.031586, 60.180639,'https://yandex.ru/maps/10941/inta/stops/3748783740/'),
		new BusStop("ул. Доковская (восток)",66.031713, 60.180887,'https://yandex.ru/maps/10941/inta/stops/3748783610/'),
		new BusStop("Кирпичный завод (запад)",66.028263, 60.181902,'https://yandex.ru/maps/10941/inta/stops/1543151720/'),
		new BusStop("Кирпичный завод (восток)",66.028018, 60.182467,'https://yandex.ru/maps/10941/inta/stops/1543151718/'),
		new BusStop("ул. Предшахтная (север)",66.023526, 60.200831,'https://yandex.ru/maps/10941/inta/stops/1543151646/'),
		new BusStop("ул. Предшахтная (юг)",66.023696, 60.198992,'https://yandex.ru/maps/10941/inta/stops/1543151652/'),
		new BusStop("Дачник (юг)",66.019801, 60.217073,'https://yandex.ru/maps/10941/inta/stops/1543151577/'),

		new BusStop("Поворот (запад)",66.017767, 60.225034,'https://yandex.ru/maps/10941/inta/stops/1543151534/'),
		new BusStop("Поворот (север)",66.017897, 60.226323,'https://yandex.ru/maps/10941/inta/stops/1543151527/'),
		new BusStop("Поворот (восток)",66.017535, 60.227117,'https://yandex.ru/maps/10941/inta/stops/1543151524/'),
		new BusStop("Поворот (юг)",66.017627, 60.225595,'https://yandex.ru/maps/10941/inta/stops/1543151528/'),

		new BusStop("ж/д Вокзал (север)",65.991490, 60.326502,'https://yandex.ru/maps/10939/komi-republic/stops/1543151313/',10),
		new BusStop("ж/д Вокзал (юг)",65.991344, 60.326787,'https://yandex.ru/maps/10939/komi-republic/stops/1543151315/',10),
		new BusStop("ул. Комсомольская (север)",65.988983, 60.322966,'https://yandex.ru/maps/216100/verhnyaya-inta/stops/3748871510/',10),
		new BusStop("ул. Комсомольская (юг)",65.988787, 60.322697,'https://yandex.ru/maps/216100/verhnyaya-inta/stops/3748871420/',10),
		new BusStop("дк. Железнодорожника (конечная)",65.984159, 60.320801,'https://yandex.ru/maps/216100/verhnyaya-inta/stops/1543151325/'),

		new BusStop("Кожимское РДП (север)",66.013318, 60.217084,'https://yandex.ru/maps/10941/inta/stops/3748788140/'),
		new BusStop("Кожимское РДП (юг)",66.013055, 60.216148,'https://yandex.ru/maps/10941/inta/stops/3748788090/'),
		new BusStop("Птицефабрика (север)",66.011821, 60.213400,'https://yandex.ru/maps/10941/inta/stops/1543151596/'),
		new BusStop("Птицефабрика (юг)",66.011530, 60.213128,'https://yandex.ru/maps/10941/inta/stops/1543151598/'),
		new BusStop("Школа №6 (север)",66.004556, 60.198329,'https://yandex.ru/maps/10941/inta/stops/1543151659/'),
		new BusStop("Школа №6 (юг)",66.004397, 60.197461,'https://yandex.ru/maps/10941/inta/stops/1543151663/'),
		new BusStop("мкр. Южный (север)",66.001704, 60.192104,'https://yandex.ru/maps/10941/inta/stops/1543151675/'),
		new BusStop("мкр. Южный(юг)",66.001588, 60.191413,'https://yandex.ru/maps/10941/inta/stops/1543151681/'),
		new BusStop("Пожарная часть (восток)",65.999117, 60.186557,'https://yandex.ru/maps/10941/inta/stops/1543151697/'),
		new BusStop("Пожарная часть (запад)",65.999109, 60.186033,'https://yandex.ru/maps/10941/inta/stops/1543151698/'),

		new BusStop("ул. Сельхозная (север)",66.048819, 60.145792,'https://yandex.ru/maps/10941/inta/stops/1543151823/'),
		new BusStop("ул. Сельхозная (юг)",66.048490, 60.147470,'https://yandex.ru/maps/10941/inta/stops/1543151822/'),
		new BusStop("ул. Заречная",66.048202, 60.123424,'https://yandex.ru/maps/10941/inta/stops/3748831470/'),
		new BusStop("Аэропорт",66.052610, 60.119854,'https://yandex.ru/maps/10939/komi-republic/stops/3748832570/'),
		new BusStop("пос. Юсьтыдор",66.051716, 60.088495,'https://yandex.ru/maps/10939/komi-republic/stops/3748832570/'),



]
module.exports.busStops = busStops;