const tbody = document.querySelector('tbody')
const search = document.querySelector('.search input')
const buttonForm = document.querySelector('.button-form')
const overlay = document.querySelector('.overlay')

const form = overlay.querySelector('.form')
const inputs = [].slice.call(form.querySelectorAll('input'))
const buttonSubmit = form.querySelector('button')

let currentAction
let currentAddress

renderAddresses(getAddresses())

search.addEventListener('input', function (e) {
  const address = searchAddress(this.value)

	renderAddresses(address)
})

buttonForm.addEventListener('click', () => {
  currentAction = 'insert'
  showForm()
})

document.body.addEventListener('keydown', e => {
  switch (e.keyCode) {
    case 13:
      if (isAllInputsNotEmpty()) {
        onSubmit()
      }
      break
    case 27:
      hideForm()
      break
  }
})

buttonSubmit.addEventListener('click', onSubmit)

function onSubmit () {
  switch (currentAction) {
    case 'insert':
      insertAddress(getUserInput())
      break
    case 'update':
      updateAddress(currentAddress, getUserInput())
      break
  }

  hideForm()
  renderAddresses(getAddresses())
}

function isAllInputsNotEmpty () {
  const emptyInput = inputs.find(input => input.value === '')

  if (emptyInput === undefined) {
    return true
  } else {
    return false
  }
}

function getUserInput () {
  if (isAllInputsNotEmpty()) {
    let data = {}

    for (const input of inputs) {
      const key = input.getAttribute('name')

      data[key] = input.value
    }

    return data
  }
}

function renderAddresses (addresses) {
  tbody.querySelectorAll('tr').forEach(row => row.remove())

  addresses.forEach((address, index) => {
    appendAddress(index+1, address)
  })
}

function appendAddress (number, address) {
  const row = document.createElement('tr')
  const numberTd = document.createElement('td')

  numberTd.innerText = number

  row.appendChild(numberTd)

  for (const key in address) {
    const td = document.createElement('td')

    td.innerText = address[key]

    row.appendChild(td)
  }

  row.appendChild(generateActionButton(address))

  tbody.appendChild(row)
}

function generateActionButton (address) {
  const td = document.createElement('td')

  for (const actionType of ['Update', 'Delete']) {
    const button = document.createElement('button')

    button.innerText = actionType
    button.classList.add(`button-${actionType.toLowerCase()}`)

    button.addEventListener('click', () => action(actionType.toLowerCase(), address))

    td.appendChild(button)
  }

  return td
}

function action (actionType, address) {
  currentAddress = address

  switch (actionType) {
    case 'update':
      currentAction = 'update'
      showForm(address)
      break
    case 'delete':
      currentAction = 'delete'
      deleteAddress(address)
      renderAddresses(getAddresses())
      break
  }
}

function insertAddress (address) {
  const addresses = getAddresses()

  window.localStorage.setItem('addresses', JSON.stringify({ addresses: [...addresses, address]}))

  currentAction = ''
}

function getAddresses () {
  const data = JSON.parse(window.localStorage.getItem('addresses'))

  if (typeof data !== 'object' || data === null) {
    return []
  }

  return data.addresses
}

function generateNewNumber () {
  return getAddresses().length
}

function updateAddress ({ phoneNumber }, updatedAddress) {
  const addresses = getAddresses()

  const addressIndex = addresses.findIndex(address => address.phoneNumber === phoneNumber)

  addresses.splice(addressIndex, 1, updatedAddress)

  window.localStorage.setItem('addresses', JSON.stringify({ addresses }))
  currentAction = ''
  currentAddress = {}
}

function deleteAddress ({ phoneNumber }) {
  const addresses = getAddresses()

  const addressIndex = addresses.findIndex(address => address.phoneNumber === phoneNumber)

  addresses.splice(addressIndex, 1)

  window.localStorage.setItem('addresses', JSON.stringify({ addresses }))
  currentAction = ''
  currentAddress = {}
}

function searchAddress (query) {
  const addresses = getAddresses()

  const filteredAddress = addresses.filter(address => {
    for (const key in address) {
      if (address[key].toLowerCase().includes(query.toLowerCase())) return address
    }
  })

  return filteredAddress
}

function showForm (address) {
  if (address !== undefined) {
    for (const input of inputs) {
      const key = input.getAttribute('name')

      input.value = address[key]
    }
  }

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
