'use strict';

// navbar를 스크롤할 때 transparent --> 지정된 색깔
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;

document.addEventListener('scroll', () => {
    if (window.scrollY > navbarHeight) {
        navbar.classList.add('navbar--dark');
    } else {
        navbar.classList.remove('navbar--dark');
    }
});

//navbar 클릭하였을 때의 원하는 태그 아이디로 스크롤 처리
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event) => {
    const target = event.target;
    const link = target.dataset.link;
    if (link == null) {
        return;
    }
    navbarMenu.classList.remove('open');
    scrollIntoView(link);
});

//navbar toggle 버튼
const navbarBtn = document.querySelector('.navbar__toggle-btn');
navbarBtn.addEventListener('click', () => {
    navbarMenu.classList.toggle('open');
});

//Home의 Contact Me 버튼 클릭 이벤트 처리
const contactMe = document.querySelector('.home__contact');
contactMe.addEventListener('click', () => {
    scrollIntoView('#contact');
});


//스크롤링 할 때 Home 화면 요소 투명하게 하기
const home = document.querySelector('.home__container');
const homeHeiht = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
    home.style.opacity = 1 - window.scrollY / homeHeiht;
});

//Home/2 화면 이상부터 스크롤을 하면 arrow btn 보이게 하기
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
    if (homeHeiht / 2 < window.scrollY) {
        arrowUp.classList.add('visible');
    }
    else {
        arrowUp.classList.remove('visible');
    }
});

//arrow btn 누르면 home 버튼으로 가기
arrowUp.addEventListener('click', () => {
    scrollIntoView('#home');
})

//work
const work = document.querySelector('.work__categories');
const project = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');

work.addEventListener('click', (event) => {
    const filter = event.target.dataset.filter;
    if (filter == null) {
        return;
    }

    //active처리
    const active = document.querySelector('.category__btn.selected');
    active.classList.remove('selected');
    event.target.classList.add('selected');

    project.classList.add('anim-out');
    setTimeout(() => {
        projects.forEach((project) => {
            const type = project.dataset.type;
            if (filter === '*' || filter === type) {
                project.classList.remove('invisible');
            } else {
                project.classList.add('invisible');
            }
        });
        project.classList.remove('anim-out');
    }, 300);
});


// IntersectionObserver API

// 1. 모든 섹션 요소들과 메뉴 아이템들을 가지고 온다
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화시킨다

const sectionIds = [
    '#home',
    '#about',
    '#skills',
    '#works',
    '#testimonials',
    '#contact'
];

const sections = sectionIds.map(section => document.querySelector(section));
const navItems = sectionIds.map(nav => document.querySelector(`[data-link="${nav}"]`));
let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
    selectedNavItem.classList.remove('active');
    selectedNavItem = selected;
    selectedNavItem.classList.add('active');
}

function scrollIntoView(selector) {
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({ behavior: "smooth" });
    selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOption = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
}
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting && entry.intersectionRatio > 0) {
            const index = sectionIds.indexOf(`#${entry.target.id}`);
            // 스크롤링이 아래로 되어서 페이지가 올라옴
            if (entry.boundingClientRect.y < 0) {
                selectedNavIndex = index + 1;
            } else {
                selectedNavIndex = index - 1;
            }
        }
    })
}
const observer = new IntersectionObserver(observerCallback, observerOption);
sections.forEach(section => observer.observe(section));

window.addEventListener('wheel', () => {
    // 스크롤이 맨 위에 위치한다면
    if (window.scrollY === 0) {
        selectedNavIndex = 0;

    }
    // 스크롤이 맨 밑에 위치한다면
    // Element.clientHeight은 엘리먼트의 내부 높이 
    else if (Math.round(window.scrollY + window.innerHeight) >= document.body.clientHeight) {
        selectedNavIndex = navItems.length - 1;
    }
    selectNavItem(navItems[selectedNavIndex]);
});