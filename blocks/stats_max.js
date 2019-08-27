//
// Visuals for max block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'stats_max',
    message0: 'Max %1 %2',
    args0: [
      {
        type: 'input_dummy'
      },
      {
        type: 'input_value',
        name: 'Column'
      }
    ],
    inputsInline: true,
    output: 'Number',
    style: 'stats_blocks',
    tooltip: '',
    helpUrl: ''
  }
])
