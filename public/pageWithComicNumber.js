var comic = {}

const title = document.getElementsByClassName('title')[0]
const date = document.getElementsByClassName('date')[0]
const transcript = document.getElementsByClassName('transcript')[0]
const comicImg = document.getElementById('comic-img')
const views = document.getElementsByClassName('views')[0]

const startProgram =async () => {
    await getDataWithNumber()
    
    mainMethods()
}

const mainMethods = () => {
    addComicImg()
    handleViewsCounter()
    addTitle()
    addDate()
    addTranscription()
}


const getDataWithNumber = async () => {
    await fetch("https://infinite-island-74981.herokuapp.com/api/getComicDataWithNumberURL")
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
  
    if (html !== undefined) {
        transcript.innerHTML = html
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



startProgram();

