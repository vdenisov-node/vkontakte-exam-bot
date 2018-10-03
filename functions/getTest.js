function parseExamFile(exam) {

  const
    listOfQuestions = exam['tasks'],
    quesntion = listOfQuestions[0],
    { description, answers, correctId } = quesntion;

  let
    partTask = `&#10071; ${description}`,
    partVariants = '';

  for (let i=0; i<answers.length; i++) {
    let el = answers[i];
    partVariants += `\n${i+1}&#8419; ${el['text']}`;
  }

  const
    partCommand = "\n&#9201; Выбери правильный ответ:",
    resultMessage = `${partTask}\n${partVariants}\n${partCommand}`;

  return {
    textOfTask: resultMessage,
    idOfCorrectAnswer: correctId
  }

}

// ######################### //

if (require.main === module) {
  //
}

module.exports = parseExamFile;
