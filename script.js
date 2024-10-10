let people = [];

const form = document.getElementById("personForm");
const personNameInput = document.getElementById("personName");
const personList = document.getElementById("personList");
const calendar = document.getElementById("calendar");

if (localStorage.getItem("people")) {
  people = JSON.parse(localStorage.getItem("people"));
  updatePersonList();
}


form.addEventListener("submit", function (event) {
  event.preventDefault();
  const personName = personNameInput.value.trim();

  if (personName && !people.includes(personName)) {
    people.push(personName);
    personNameInput.value = "";
    updatePersonList();
  } else if (people.includes(personName)) {
    alert("Este nome já foi adicionado");
  }
});


function removerPessoa(index) {
  const person = people[index];
  alert(`${person} foi removido(a) da lista.`); 
  people.splice(index, 1);
  updatePersonList(); 
}

function updatePersonList() {
  personList.innerHTML = ""

  people.forEach((person, index) => {
    const listItem = document.createElement("li")
    listItem.textContent = person

 
    const removeButton = document.createElement('button')
    removeButton.classList.add('remove-button')
    removeButton.textContent = 'Remover'


    removeButton.addEventListener('click', () => {
      removerPessoa(index);
    });

    listItem.appendChild(removeButton)
    personList.appendChild(listItem)
  });

  localStorage.setItem("people", JSON.stringify(people)); 
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Gera a escala de café
function generateSchedule() {
  if (people.length < 2) {
    alert("Adicione ao menos 2 pessoas para gerar a escala.");
    return;
  }

  calendar.innerHTML = "";

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysOfWeek = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  const calendarHeader = document.createElement("h2");
  calendarHeader.textContent = `${today.toLocaleString("default", {
    month: "long",
  })} ${year}`;
  calendar.appendChild(calendarHeader);

  const calendarTable = document.createElement("table");
  const tableHeader = document.createElement("tr");

  daysOfWeek.forEach((day) => {
    const th = document.createElement("th");
    th.textContent = day;
    tableHeader.appendChild(th);
  });

  calendarTable.appendChild(tableHeader);
  let tableBody = document.createElement("tr");

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dayOfWeek = date.getDay();

    if (i === 1 && dayOfWeek !== 0) {
      for (let j = 0; j < dayOfWeek; j++) {
        const td = document.createElement("td");
        tableBody.appendChild(td);
      }
    }

    const td = document.createElement("td");
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      let shuffledPeople = [...people];
      shuffleArray(shuffledPeople);

      const morningPerson = shuffledPeople.pop();
      const afternoonPerson = shuffledPeople.pop();

      td.innerHTML = `<strong>${i}</strong><br/>Manhã: ${morningPerson}<br/>Tarde: ${afternoonPerson}`;
    } else {
      td.innerHTML = `<strong>${i}</strong><br/>--`;
    }
    tableBody.appendChild(td);

    // Cria uma nova linha se for sábado
    if (dayOfWeek === 6) {
      calendarTable.appendChild(tableBody);
      tableBody = document.createElement("tr");
    }
  }

  calendarTable.appendChild(tableBody);
  calendar.appendChild(calendarTable);
}

function exportToPDF() {
  const calendarElement = document.getElementById("calendar");

  if (!calendarElement.innerHTML.trim()) {
    alert("Nenhuma escala gerada para exportar.");
    return;
  }

  const options = {
    margin: [10, 10, 10, 10],
    filename: "escala_cafe.pdf",
    html2canvas: { scale: 2, scrollY: 0 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: {
      mode: ["avoid-all"],
    },
  };


  const element = document.getElementById("calendar");


  html2pdf().set(options).from(element).save();
}
