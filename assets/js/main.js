const tbody = document.querySelector('tbody')
const search = document.querySelector('.search input')
const buttonForm = document.querySelector('.button-form')
const overlay = document.querySelector('.overlay')

const form = overlay.querySelector('.form')
const inputs = form.querySelectorAll('input')
const inputName = document.getElementsByName('name')[0]
const inputPhoneNumber = document.getElementsByName('phone_number')[0]
const inputAddress = document.getElementsByName('address')[0]
const inputEmail = document.getElementsByName('email')[0]
const buttonSubmit = form.querySelector('button')

renderAddresses(getAddresses())

search.addEventListener('input', function (e) {
  const addresses = getAddresses()

	const filteredAddress = addresses.filter(address => {
    for (const key in address) {
      if (address[key].toLowerCase().includes(this.value.toLowerCase())) return address
		}
	})

	const rows = tbody.querySelectorAll('tr').forEach(row => row.remove())

	renderAddresses(filteredAddress)
})

inputEmail.addEventListener('keyup', e => e.keyCode == 13 ? insertAddress() : false) // insert address on enter
form.querySelector('button').addEventListener('click', insertAddress) // insert address
buttonForm.addEventListener('click', showForm) // show form
overlay.querySelector('.close').addEventListener('click', hideForm) // hide form
document.body.addEventListener('keydown', e => e.keyCode == 27 ? hideForm() : false) // hide form

function getAddresses () {
  const data = JSON.parse(window.localStorage.getItem('addresses'))

  if (typeof data !== 'object' || data === null) {
    return []
  }

  return data.addresses
}

function insertAddress () {
  const name = inputName.value
  const phoneNumber = inputPhoneNumber.value
  const address = inputAddress.value
  const email = inputEmail.value

  if (inputName.value !== '' || inputPhoneNumber.value !== '' || inputAddress.value !== '' || inputEmail.value !== '') {
    const addresses = getAddresses()
    const newAddress = { name, phoneNumber, address, email }

    window.localStorage.setItem('addresses', JSON.stringify({ addresses: [...addresses, newAddress]}))

    appendAddress(getAddresses().length, name, phoneNumber, address, email)

    hideForm()
  }
}

function renderAddresses (addresses) {
	for (var i = 0; i < addresses.length; i++) {
		appendAddress(i+1, ...Object.values(addresses[i]))
	}
}

function appendAddress (number, name, phoneNumber, address, email) {
  const row = document.createElement('tr')
  const numberData = document.createElement('td')
  const nameData = document.createElement('td')
  const phoneNumberData = document.createElement('td')
  const addressData = document.createElement('td')
  const emailData = document.createElement('td')

  numberData.innerText = number
  phoneNumberData.innerText = phoneNumber
  nameData.innerText = name
  addressData.innerText = address
  emailData.innerText = email

  row.appendChild(numberData)
  row.appendChild(nameData)
  row.appendChild(phoneNumberData)
  row.appendChild(addressData)
  row.appendChild(emailData)

  tbody.appendChild(row)
}

function showForm () {
  overlay.style.display = 'flex'
  setTimeout(() => {
    overlay.style.opacity = 1
	}, 0)
}

function hideForm () {

  overlay.style.opacity = 0
  setTimeout(() => {
    overlay.style.display = 'none'
    inputs.forEach(input => input.value = '')
	}, 300)
}
