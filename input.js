'use strict';

// The following is in a variable rather than in a comment
// because that way it can be output.
var license="Stenopgaver\n\
Copyright (C) 2018 Lars Rune Præstmark\n\
\n\
This program is free software; you can redistribute it and/or\n\
modify it under the terms of the GNU General Public License\n\
as published by the Free Software Foundation; either version 2\n\
of the License, or (at your option) any later version.\n\
<br/>\n\
This program is distributed in the hope that it will be useful,\n\
but WITHOUT ANY WARRANTY; without even the implied warranty of\n\
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n\
GNU General Public License for more details.\n\
<br/>\n\
You should have received a <a href=\"LICENSE\">copy of the\n\
GNU General Public License</a>\n\
along with this program; if not, write to the Free Software\n\
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.\n\
"


var outString=""
var counting=false
var countFrom=false
var countTo=false
var doneCounting=false
var writeField
var showField
var theoryField

var WAIT='WAIT'
var PART='PART'
var RIGHT='RIGHT'
var WRONG='WRONG'

function fillText(){
    showField=document.getElementById("textDisplay")
    writeField=document.getElementById("textInput")
    theoryField=document.getElementById("textTheory")
    var splitAdress=(document.location).toString().split('?')
    var lastPart=''
    var hashAmount=splitAdress.length
    if(hashAmount>=2){
        lastPart=splitAdress[1]
    }
    if(lastPart==''){
        outString='<ul>\n'
        var lessons=document.getElementsByClassName('lesson')
        for (var i=0; i<lessons.length; i++){
            var element=lessons[i]
            var headings=element.getElementsByTagName('h2')
            outString+='<li><a href="write.htm?'+i+'">'+headings[0].innerHTML+'</a></li>\n'
        }
        outString+='</ul>'
        showField.innerHTML=outString.replace(/\n/g,'<br>')
        theoryField.innerHTML="Select a lesson:"
        writeField.style="display: none;"
        showField.innerHTML+='<hr>'+license
    }
    else{
        var lessons=document.getElementsByClassName('lesson')
        var index=Number(lastPart)
        if(lessons[index]!=undefined){
            var theory=lessons[index].getElementsByClassName('theory')[0]
            theoryField.innerHTML=theory.innerHTML
            var writeText=lessons[index].getElementsByClassName('writingExercise')[0]
            outString=writeText.innerHTML
        }
        else{
            theoryField.style="display: none;"
        }
        showField.innerHTML=outString.replace(/\n/g,'<br>')
        writeField.onkeyup=checkText
    }
}
function checkText(){
    var wordsOut=outString.split(' ')
    var wordsIn =writeField.value.split(' ')
    var wordsNew = Array()
    var checkLength=wordsOut.length
    if(counting==false){
        countFrom=Date.now()
        counting=true
    }
    if(wordsIn.length<wordsOut.length){
        checkLength=wordsIn.length
    }
    var newWords=[]
    for(var i=0;i<wordsOut.length;i++){
        if((i<checkLength)&&(wordsIn[i]==wordsOut[i])){
            newWords.push([RIGHT, wordsOut[i]])
        }
        else if(wordsIn[i]==''){
            newWords.push([WAIT, wordsOut[i]])
        }
        else if((i<checkLength)&&(wordsOut[i].startsWith(wordsIn[i]))){
            if(wordsIn.length<=i+1){
                var x=[PART, wordsOut[i], wordsIn[i].length]
                newWords.push(x)
            }
            else{
                var x=[WRONG, wordsOut[i]]
                newWords.push(x)
            }
        }
        else if(i<wordsIn.length){
            newWords.push([WRONG, wordsOut[i]])
        }
        else{
            newWords.push([WAIT, wordsOut[i]])
        }
    }
    //var newText=newWords.join(' ').replace(/\n/g,'<br>')
    var newText=''
    var previousStatus=WAIT
    var statusCodes=Array()
    for (i in newWords){
        var rawWord=newWords[i]
        if(previousStatus==WAIT){
            statusCodes[WAIT]=''
            statusCodes[RIGHT]='<span class="right">'
            statusCodes[WRONG]='<span class="wrong">'
        }
        else if(previousStatus==RIGHT){
            statusCodes[WAIT]='</span>'
            statusCodes[RIGHT]=''
            statusCodes[WRONG]='</span><span class="wrong">'
        }
        else if(previousStatus==WRONG){
            statusCodes[WAIT]='</span>'
            statusCodes[RIGHT]='</span><span class="right">'
            statusCodes[WRONG]=''
        }
        if(i!=0){
            newText+=' '
        }
        if(rawWord[0]==WAIT){
            newText+=statusCodes[WAIT]+rawWord[1]
            previousStatus=WAIT
        }
        else if(rawWord[0]==WRONG){
            newText+=statusCodes[WRONG]+rawWord[1]
            previousStatus=WRONG
        }
        else if(rawWord[0]==RIGHT){
            newText+=statusCodes[RIGHT]+rawWord[1]
            previousStatus=RIGHT
        }
        else if(rawWord[0]==PART){
            var startWord=rawWord[1].substring(0, rawWord[2])
            var endWord=rawWord[1].substring(rawWord[2], rawWord[1].length)
            newText+=statusCodes[RIGHT]+startWord+'</span>'+endWord
            previousStatus=WAIT
        }
    }
    if(previousStatus!=WAIT){
        newText+='</span>'
    }
    showField.innerHTML=newText
    if((writeField.value==outString)&&(!doneCounting)){
        countTo=Date.now()
        var timeTaken=(countTo-countFrom)/1000
        var outLength=outString.length
        timeField=document.getElementById("timeField")
        timeField.innerHTML=outLength.toString()+" characters in "+((Math.round(timeTaken*100))/100).toString()+" seconds: "+(Math.round(100*outLength/timeTaken)/100).toString()+" CPS"
        doneCounting=true
        writeField.onkeyup=undefined
    }
    writeField=document.getElementById("textInput")
}
window.onload=fillText
