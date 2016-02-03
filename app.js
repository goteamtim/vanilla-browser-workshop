var addSkillButton = document.querySelector('.add-skill')
var skillTemplate = document.querySelector('.skill').cloneNode(true)
var apiURL = '//sandiegojs-vanilla-workshop.herokuapp.com'

function addSkillHandler(evt) {
  var prevSkill = last('.skill')
  var submitNode = document.querySelector('.submit')
  var form = submitNode.parentNode
  var newSkill = skillTemplate.cloneNode(true)

  prevSkill.querySelector('.add-skill').classList.add('hidden')
  prevSkill.querySelector('.remove-skill').classList.remove('hidden')

  newSkill.querySelector('.add-skill').addEventListener('click', addSkillHandler)
  newSkill.querySelector('.remove-skill').addEventListener('click', removeSkillHandler)
  form.insertBefore(newSkill, submitNode)
}

function last(selector){
	var all = document.querySelectorAll(selector)
	var length = all.length
	return all[length - 1]
}


var removeSkillButton = document.querySelector('.remove-skill')
var removeSkillHandler = function(evt) {
 	var skill = evt.currentTarget.parentNode
 	skill.remove();
}

removeSkillButton.addEventListener('click',removeSkillHandler)

addSkillButton.addEventListener('click', addSkillHandler)


var form = document.querySelector('form')

var submitHandler = function(evt){
	evt.preventDefault()
	var path = apiURL + '/forms'
	xhr('POST', path, serializeArray('form'), function(err, data){
		if(err) {throw err}
			console.log(data)
	})
	//var data = serializeArray('form')
}

form.addEventListener('click', submitHandler)

var serializeArray = function(selector){
	var form = document.querySelector(selector)
	var formInputs = form.querySelectorAll('input:not([type=submit]),textarea')
	
	//Empty object for us to set key values
	var data = {}


	for (var i = 0; i < formInputs.length; i++) {

		var item = formInputs[i]
		if (item.name === 'skills_attributes') {
			if (!!data[item.name]) {
				data[item.name].push({'description': item.value})
			}else{
				data[item.name] = [{'description': item.value}]
			}
		}else{
			data[item.name] = item.value
		}
		
	}
	var wrapper = {};
	wrapper[form.name] = data;
	return data
}

var xhr = function(method, path, data, callback) {
	var request = new XMLHttpRequest()
	request.open(method,path,true)
	request.setRequestHeader('content-type','application/json')
	request.onreadystatechange = function(){
		//Ignore anything that isnt the last state
		if (request.readyState !== 4) {return}

		//if we didnt get a good status (200) send an error
		if (request.readystate !== 4 && (request.status !== 200 && request.status !== 201)) {
			callback(new Error('XHR Failed: ' + path), null)
		}
		callback(null, JSON.parse(request.responseText))
	}
	request.send(JSON.stringify(data))
}