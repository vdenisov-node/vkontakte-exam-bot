function* generateTest(source, start, count) {

  const listOfQuestions = source['tasks'];

  for (let index = start-1; index < start+count-1; index++) {

    let quesntion = listOfQuestions[index];
  
    let { _id, description, answers, correctId } = quesntion;
  
    let
      partTask = `&#10071; ${description}`,
      partVariants = '';
  
    for (let i=0; i<answers.length; i++) {
      let el = answers[i];
      partVariants += `\n${i+1}&#8419; ${el['text']}`;
    }
  
    let
      partCommand = "\n&#9201; Выбери правильный ответ:",
      resultMessage = `${partTask}\n${partVariants}\n${partCommand}`;

    yield {
      idOfTask: _id,
      textOfTask: resultMessage,
      idOfCorrectAnswer: correctId
    }

  }

}

// ######################### //

if (require.main === module) {
  const exam = require('./../database/exam.json');

  // console.log(
  //   JSON.stringify([
  //     ...generateTest(source = exam, start = 1, count = 4)
  //   ], null, 4)
  // )
  
  const result = [ ...generateTest(source = exam, start = 1, count = 4) ];
  console.log(result);

}

module.exports = generateTest;
