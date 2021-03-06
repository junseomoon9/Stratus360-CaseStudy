var comic = {}
var totalComics = 0;

const prevButton = document.getElementsByClassName('prev-button')[0];
const nextButton = document.getElementsByClassName('next-button')[0];
const randomButton = document.getElementsByClassName('random-button')[0];
const title = document.getElementsByClassName('title')[0]
const date = document.getElementsByClassName('date')[0]
const transcript = document.getElementsByClassName('transcript')[0]
const comicImg = document.getElementById('comic-img')
const views = document.getElementsByClassName("views")[0]

const startProgram =async () => {
    await getData()
    mainMethods()
}

const mainMethods = () => {
    handleViewsCounter()
    addComicImg()
    addTitle()
    addDate()
    addTranscription()
    checkIfNextBtnShouldBeDisabled()
    checkIfPrevBtnShouldBeDisabled()
}


const getData = async () => {
    await fetch("https://infinite-island-74981.herokuapp.com/api/getComicData", {method: "GET"})
    .then(async res => {
        comic = await res.json()
        totalComics = comic.num
        console.log(comic)
    })
    
}

const getDataWithNumber = async (comicNumber) => {
    await fetch("https://infinite-island-74981.herokuapp.com/api/getComicDataWithNumber", {
        method: "POST",
        headers: {
        'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({comicNumber: comicNumber})})
    .then(async res => {
        comic = await res.json()
        console.log(comic)
    })
}

const handleViewsCounter = () => {
    var comics = JSON.parse(localStorage.getItem("comics"))
    if (comics == null) {
        comics = []
        var entry = {
            "num": comic.num,
            "views": 1
        }
        views.textContent = "Views: " + entry.views
        comics.push(entry)
        localStorage.setItem("comics", JSON.stringify(comics))
    } else {
        const matchingComicIndex = comics.findIndex(entry => entry.num === comic.num)
        if (matchingComicIndex === -1) {
            var entry = {
                "num": comic.num,
                "views": 1
            }
            views.textContent = "Views: " + entry.views
            comics.push(entry)
            localStorage.setItem("comics", JSON.stringify(comics))
        } else {
            comics[matchingComicIndex].views += 1
            views.textContent = "Views: "+ comics[matchingComicIndex].views 
            localStorage.setItem("comics", JSON.stringify(comics))
        }
    }
    console.log(comics)
    
}

const addComicImg = () => {
    
    comicImg.src = `${comic.img}`;
    comicImg.alt = `${comic.alt}`;
}

const addTitle = () => {
    title.textContent = comic.title
}
const addDate = () => {
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const month = months[comic.month-1]
    const dateString = `${month} ${comic.day}, ${comic.year}`
    
    date.textContent = dateString
}

const addTranscription = () => {
    const html = parseTranscription(comic.transcript)
    console.log(html)
    if (html !== undefined) {
        transcript.innerHTML = html
    }
    
}

const checkIfNextBtnShouldBeDisabled = () => {
    if (comic.num === totalComics) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

const checkIfPrevBtnShouldBeDisabled = () => {
    if (comic.num === 1) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }
}

const parseTranscription = (transcription) => {
    if (transcription === "") {
        return undefined
    } else {
        var strings = []
        var startingIndex = 0
        const length = transcription.length
        
        var count = 0
        while (startingIndex < length - 1) {
            var letter = transcription[startingIndex]
            
            var lastIndex = 0
            if (letter === "[") {
                lastIndex = transcription.indexOf("]", startingIndex) + 2
            } else if (letter === "(") {
                lastIndex = transcription.indexOf(")", startingIndex) + 2
            } else if (letter === "{") {
                lastIndex = transcription.indexOf("}", startingIndex) + 2
            } else {
                var lastPossibleIndicies = []
                if (transcription.indexOf("[", startingIndex) > 0) {
                    lastPossibleIndicies.push(transcription.indexOf("[", startingIndex))
                }
                if (transcription.indexOf("{", startingIndex) > 0) {
                    lastPossibleIndicies.push(transcription.indexOf("{", startingIndex))
                }
                if (transcription.indexOf("(", startingIndex) > 0) {
                    lastPossibleIndicies.push(transcription.indexOf("(", startingIndex))
                }
            
                lastIndex = Math.min(...lastPossibleIndicies)
                
            }
            strings[count] = transcription.substring(startingIndex, lastIndex)
            count = count + 1
            startingIndex = lastIndex 
            
        }
    
        var html = strings[0] + "<br>"
        
        for (var i = 1; i < strings.length; i++) {
            html += " "
            html += strings[i] + " <br><br>"
            
    
        }
        
        return html
    }
    
}

prevButton.addEventListener('click', async event => {
    await getDataWithNumber(comic.num-1)

    mainMethods()
});

nextButton.addEventListener('click', async event => {
    await getDataWithNumber(comic.num+1)
    mainMethods()
});

randomButton.addEventListener('click', async event => {
    const comicNumber = Math.round(Math.random() * totalComics)
    console.log(comicNumber)
    await getDataWithNumber(comicNumber)
    mainMethods()
});


startProgram();

