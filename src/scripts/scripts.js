const addButton = document.querySelector('.input__button');
const search = document.querySelector('.header__search-input');
const tabList = document.querySelector('.tab');
const input = document.querySelector('.input__textarea');
const toDo = document.querySelector('.toDo__list');

// Значение по умолчанию для списка задач
let toDoList = [];
// Значение по умолчанию для активной вкладки
let tab = 'All';
// Значение по умолчанию для id первой задачи - используется для уникальности каждой записи
let id = 0;

// Считываем tab из local storage, если там пусто, то записываем All
if (JSON.parse(localStorage.getItem('tab')) === null) {
  localStorage.setItem('tab', JSON.stringify(tab));
} else {
  tab = JSON.parse(localStorage.getItem('tab'));
}

// Считываем id из local storage, если там пусто, то записываем 0
if (JSON.parse(localStorage.getItem('id')) === null) {
  localStorage.setItem('id', JSON.stringify(id));
} else {
  id = JSON.parse(localStorage.getItem('id'));
}

// Проверяет на сенсорный экран
function isTouchDevice() {
  return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

// Скрытие ввода во вкладке Done
function inputOnOff() {
  const inputSection = document.querySelector('.input');
  if (tab === 'Done') {
    inputSection.classList.add('input-off');
  } else {
    inputSection.classList.remove('input-off');
  }
}

// Инвертируем класс tab__links--active у активной вкладки
function setTabClass() {
  document.querySelectorAll('.tab__links').forEach((item) => {
    if (item.innerHTML === tab) {
      item.classList.toggle('tab__links--active');
    }
  });
}

// Выводим результат с учётом активной вкладки и поиска
function displayItems() {
  let items = '';
  let toDoOut = [];
  if (tab === 'All') {
    toDoOut = toDoList.slice();
  } else if (tab === 'Active') {
    toDoOut = toDoList.filter(item => item.done === false);
  } else if (tab === 'Done') {
    toDoOut = toDoList.filter(item => item.done === true);
  }
  if (search.value !== '') {
    toDoOut = toDoOut.filter(item => item.text.toLowerCase().includes(search.value.toLowerCase()) === true);
  }
  if (toDoOut.length === 0) {
    toDo.innerHTML = '';
  }
  toDoOut.forEach((item) => {
    items += `
    <li class="toDo__list-item list-item ${item.done ? 'list-item--done' : ''} ${item.important ? 'list-item--important' : ''} ${isTouchDevice() ? 'list-item--touch' : ''}" id="${item.id}" tabindex="0">
			<span class="list-item__text" title='${item.text}'>${item.text.replace(/\n/g, '<br/>')}</span>
			<button class="list-item__mark mark">${item.important ? 'NOT IMPORTANT' : 'MARK IMPORTANT'}</button>
			<button class="list-item__del del"></button>
		</li>`;
    toDo.innerHTML = items;
  });
}

setTabClass();
inputOnOff();

// Обрабатываем переключение между вкладками, активную записываем в tab и local storage
tabList.addEventListener('click', (ev) => {
  if (ev.target.closest('.tab__links')) {
    setTabClass();
    ev.target.classList.toggle('tab__links--active');
    tab = ev.target.innerHTML;
    localStorage.setItem('tab', JSON.stringify(tab));
    displayItems();
    inputOnOff();
  }
});

// Считываем наш to do list из local storage
if (localStorage.getItem('toDoList')) {
  toDoList = JSON.parse(localStorage.getItem('toDoList'));
  displayItems();
}

// При клике на кнопку добавляем элемент в массив и local storage
addButton.addEventListener('click', () => {
  if (input.value === '') {
    alert('You must write something!');
  } else {
    const newToDoList = {
      id,
      text: input.value,
      done: false,
      important: false,
    };
    toDoList.push(newToDoList);
    displayItems();
    input.value = '';
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
    id += 1;
    localStorage.setItem('id', JSON.stringify(id));
  }
});

// При вводе поиска обновляет to do list
search.addEventListener('input', displayItems);

const list = document.querySelector('.toDo__list');

// Обработчик нажатия enter на задаче
list.addEventListener('keypress', (ev) => {
  if (ev.key === 'Enter') {
    ev.target.click();
  }
});

// Обработчик клика на элемент списка
list.addEventListener('click', (ev) => {
  // Отмечает задачу выполненной
  if (ev.target.tagName === 'LI' || ev.target.closest('.list-item__text')) {
    let value;
    let num;
    if (ev.target.closest('.list-item__text')) {
      ev.target.parentElement.classList.toggle('list-item--done');
      value = ev.target.innerHTML.replace(/<br>/g, '\n');
      num = +ev.target.parentElement.id;
    } else {
      ev.target.classList.toggle('list-item--done');
      value = ev.target.children[0].innerHTML.replace(/<br>/g, '\n');
      num = +ev.target.id;
    }
    toDoList.forEach((item) => {
      if (item.text === value && item.id === num) {
        item.done = !item.done;
        localStorage.setItem('toDoList', JSON.stringify(toDoList));
      }
    });
  }

  // Удаляет задачу из списка
  const del = ev.target.closest('.list-item__del');
  if (del) {
    const value = del.parentElement.children[0].innerHTML.replace(/<br>/g, '\n');
    const num = +del.parentElement.id;
    toDoList.forEach((item, i) => {
      if (item.text === value && item.id === num) {
        toDoList.splice(i, 1);
      }
    });
    toDoList.forEach((item, i) => {
      item.id = +i;
    });
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
    id -= 1;
    localStorage.setItem('id', JSON.stringify(id));
    displayItems();
  }

  // Делает задачу важной
  const mark = ev.target.closest('.list-item__mark');
  if (ev.target.closest('.list-item__mark')) {
    mark.parentElement.classList.toggle('list-item--important');
    mark.innerHTML = (mark.innerHTML === 'MARK IMPORTANT') ? 'NOT IMPORTANT' : 'MARK IMPORTANT';
    const value = mark.parentElement.children[0].innerHTML.replace(/<br>/g, '\n');
    const num = +mark.parentElement.id;
    toDoList.forEach((item) => {
      if (item.text === value && item.id === num) {
        item.important = !item.important;
        localStorage.setItem('toDoList', JSON.stringify(toDoList));
      }
    });
  }
});
