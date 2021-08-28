/* Theme changer */
const theme = document.querySelector(".theme")
const body = document.body

window.onload = checkTheme();

function checkTheme() {
    if(localStorage.getItem("theme") === null) {
        localStorage.setItem("theme", "light")
    } else {
        const themeUser = localStorage.getItem("theme")
        body.classList = themeUser
    }
    
}


theme.addEventListener("click", (e) => {
    if(body.classList.contains("dark")) {
      body.classList.remove("dark")
      localStorage.setItem("theme", "light")
      theme.src = "./images/moon.svg"
    } else {
      body.classList.add("dark")
      theme.src = "./images/light.svg"
      localStorage.setItem("theme", "dark")
    }
  })
  
