let addButton = document.querySelector('.input__button'),
search = document.querySelector('.header__search-input'),
tabList = document.querySelector('.tab'),
input = document.querySelector('.input__textarea'),
toDo = document.querySelector('.toDo__list');

let toDoList = [];
let tab = 'All';

if (JSON.parse(localStorage.getItem('tab')) === null){		//Считываем tab из local storage, если там пусто, то записываем All
	localStorage.setItem('tab', JSON.stringify(tab));
} else {
	tab = JSON.parse(localStorage.getItem('tab'));
}

setTabClass();
inputOnOff();

function inputOnOff() { 		//Скрытие ввода во вкладке Done
	let inputSection = document.querySelector('.input');
	if (tab === 'Done'){
		inputSection.classList.add('input-off');
	} else {
		inputSection.classList.remove('input-off');
	}
}

tabList.addEventListener('click', function(ev){			//Обрабатываем переключение между вкладками, активную записываем в tab и local storage
	if(ev.target.closest('.tab__links')){
		setTabClass();
		ev.target.classList.toggle('tab__links--active');
		tab = ev.target.innerHTML;
		localStorage.setItem('tab', JSON.stringify(tab));
		displayItems();
		inputOnOff();
	}
});

if (localStorage.getItem('toDoList')) {			//Считываем наш to do list из local storage
	toDoList = JSON.parse(localStorage.getItem('toDoList'));
	displayItems();
}

addButton.addEventListener('click', function(){			//При клике на кнопку добавляем элемент в массив и local storage
	if (input.value === '') {
		alert('You must write something!')
	}
	else {
		let newToDoList = {
			text: input.value,
			done: false,
			important: false
		};
		toDoList.push(newToDoList);
		displayItems();
		input.value = '';
		localStorage.setItem('toDoList', JSON.stringify(toDoList));
	}
});

function setTabClass(){			//Инвертируем класс tab__links--active у активной вкладки
	document.querySelectorAll('.tab__links').forEach(function(item) {
		if (item.innerHTML === tab){
			item.classList.toggle('tab__links--active');
		}
	});
}

function displayItems() {		//Выводим результат с учётом активной вкладки и поиска
	let items = '';
	let toDoOut = [];
	if (tab === 'All'){
		toDoOut = toDoList.slice();
	} else if (tab === 'Active'){
		toDoOut = toDoList.filter(item => item.done === false)
	} else if (tab === 'Done'){
		toDoOut = toDoList.filter(item => item.done === true)
	}
	if (search.value !== ''){
		toDoOut = toDoOut.filter(item => item.text.toLowerCase().includes(search.value.toLowerCase()) === true)
	}
	if (toDoOut.length === 0){
		toDo.innerHTML = '';
	}
	toDoOut.forEach(function(item) {
		items += `
		<li class="toDo__list-item list-item ${item.done ? 'list-item--done' : ''} ${item.important ? 'list-item--important' : ''} ${isTouchDevice() ? 'list-item--touch' : ''}" tabindex=0>
			<span class="list-item__text" title='${item.text}'>${item.text.replace(/\n/g,'<br/>')}</span>
			<button class="list-item__mark mark">${item.important ? 'NOT IMPORTANT' : 'MARK IMPORTANT'}</button>
			<button class="list-item__del del"></button>
		</li>`;
		toDo.innerHTML = items;
	});	
}

let searchWrap = document.querySelector('.header__search-wrapper')			//Возможно нужно убрать, бесполезная штука
searchWrap.addEventListener('click', function(ev){
	if (ev.target.closest('.header__search-wrapper')){
		displayItems();
	}
});

search.addEventListener('input', displayItems); 			//При вводе поиска обновляет to do list

let list = document.querySelector('.toDo__list');
list.addEventListener('click', function(ev){			//Обработчик клика на элемент списка

	if (ev.target.tagName === 'LI' || ev.target.closest('.list-item__text')){			//Отмечает задачу выполненной
		let value;
		if (ev.target.closest('.list-item__text')){
			ev.target.parentElement.classList.toggle('list-item--done');
			value = ev.target.innerHTML.replace(/<br>/g, '\n');
		} else {
			ev.target.classList.toggle('list-item--done');
			value = ev.target.children[0].innerHTML.replace(/<br>/g, '\n');
		}
		toDoList.forEach(function(item) {
			if (item.text === value){
				item.done = !item.done;
				localStorage.setItem('toDoList', JSON.stringify(toDoList));
			}
		});
	}
	
	let del = ev.target.closest ('.list-item__del')
	if (del){			//Удаляет задачу из списка
		let value = del.parentElement.children[0].innerHTML.replace(/<br>/g, '\n');
		toDoList.forEach(function(item, i) {
			if (item.text === value){
				toDoList.splice(i, 1);
				displayItems();
				localStorage.setItem('toDoList', JSON.stringify(toDoList));
			}
		});
	}	

	let mark = ev.target.closest ('.list-item__mark')			//Делает задачу важной
	if (ev.target.closest ('.list-item__mark')) {
		mark.parentElement.classList.toggle('list-item--important');
		mark.innerHTML = (mark.innerHTML === 'MARK IMPORTANT') ? 'NOT IMPORTANT' : 'MARK IMPORTANT';
		let value = mark.parentElement.children[0].innerHTML.replace(/<br>/g, '\n');
		toDoList.forEach(function(item) {
			if (item.text === value){
				item.important = !item.important;
				localStorage.setItem('toDoList', JSON.stringify(toDoList));
			}
		});
	}
});

function isTouchDevice() {
	return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

//Ошибки при отметке одного из нескольких одинаковых объектов
