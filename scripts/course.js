const list = document.getElementById('list');

const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: [
            'Python'
        ],
        completed: true


    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: [
            'HTML',
            'CSS'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: [
            'C#'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    }
]


function createCourseCard(courses){
    list.innerHTML = '';
    creditcount = 0;
    courses.forEach((course, index) => {
        const dialogid = `course-info${index}`;
        creditcount += course.credits;
        const btn_container = document.createElement('div');
        btn_container.classList.add('btn_container');
        const course_btn = document.createElement('button');
        course_btn.classList.add('course_btn');
        course_btn.setAttribute("popovertarget", dialogid);
        course_btn.setAttribute("popovertargetaction", "show");

       
        const name = document.createElement('p');
         if (course.completed == true){
            course_btn.style.backgroundColor = "white";
            course_btn.style.color = "black";
            name.innerHTML = "✅ "
        }
        name.innerHTML += `${course.subject} ${course.number}`;
        const dialog = document.createElement('div');
        dialog.classList.add("popup");
        dialog.setAttribute("id", dialogid);
        dialog.setAttribute("popover", "");
        dialog.innerHTML = `<div><h2>${course.subject} ${course.number}</h2><button class="close-button" popovertarget="${dialogid}" 
        popovertargetaction="hide">X</button></div><h3>${course.title}</h3><p>${course.credits} Credits</p>
        <p>Certificate: ${course.certificate}</p><p>${course.description}</p>
        <p>Technology: ${course.technology.map(tech => tech).join(", ")}</p>`;
        course_btn.append(name);
        btn_container.appendChild(course_btn);
        btn_container.appendChild(dialog);
        list.appendChild(btn_container);
    })
    const creditDisplay = document.getElementById("credit-display");
    creditDisplay.innerText = `The total credits for courses listed above are ${creditcount}`;
}
createCourseCard(courses);
const all = document.getElementById('all');
const cse = document.getElementById('cse');
const wdd = document.getElementById('wdd');

all.addEventListener('click', () => {
    createCourseCard(courses);
})
cse.addEventListener('click', () =>{
    createCourseCard(courses.filter(course => course.subject.startsWith('CSE')));
})
wdd.addEventListener('click', () =>{
    createCourseCard(courses.filter(course => course.subject.startsWith('WDD')));
})