export function calcResult(participants) {
    var data = [new Array(), new Array(), 0]
    var beta0, beta1
    var min = Infinity, max = -Infinity
    var xavr = 0, yavr = 0
    var temp0 = 0, temp1 = 0
    var sigma2 = 0
    for(var i in participants) {
      if(participants[i].sequence == "answered") {
        data[0].push([participants[i].sdef, participants[i].answer])
        xavr += participants[i].sdef
        yavr += participants[i].answer
        if(participants[i].sdef > max) max = participants[i].sdef
        if(participants[i].sdef < min) min = participants[i].sdef
      }
    }

    xavr /= data[0].length
    yavr /= data[0].length

    for(var i in participants) {
      temp1 += (participants[i].sdef - xavr) * (participants[i].answer - yavr)
      temp0 += (participants[i].sdef - xavr) * (participants[i].sdef - xavr)
    }

    beta1 = temp1 / temp0
    beta0 = yavr - beta1 * xavr
    data[1] = [[min, beta0 + beta1 * min], [max, beta0 + beta1 * max]]

    for(var i = 0; i < data[0].length; i++) {
      sigma2 += Math.pow(data[0][i][1] - (beta0 + beta1 * data[0][i][0]), 2)
    }
    sigma2 /= data[0].length - 2

    data[2] =
      [beta0 / (Math.sqrt(sigma2 * (1 / data[0].length + xavr * xavr / temp0))),
       beta1 / (Math.sqrt(sigma2 / temp0))]
    return data
}