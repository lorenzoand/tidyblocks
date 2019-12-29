//
// Visuals for one-sample Z-test.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'stats_z_test_one_sample',
    message0: 'One-sample Z-test',
    args0: [],
    message1: 'column %1 mean μ %2 std dev σ %3 significance α %4',
    args1: [
      {
        type: 'field_input',
        name: 'COLUMN',
        text: 'column'
      },
      {
        type: 'field_number',
        name: 'MEAN',
        value: 0.0
      },
      {
        type: 'field_number',
        name: 'STD_DEV',
        value: 1.0
      },
      {
        type: 'field_number',
        name: 'SIGNIFICANCE',
        value: 0.05
      }
    ],
    inputsInline: false,
    previousStatement: null,
    style: 'stats_blocks',
    tooltip: 'perform one-sample Z-test',
    helpUrl: ''
  }
])

//
// Visuals for Kruskal-Wallis test.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'stats_kruskal_wallis',
    message0: 'Kruskal-Wallis test',
    args0: [],
    message1: 'groups %1 values %2 significance α %3',
    args1: [
      {
        type: 'field_input',
        name: 'GROUPS',
        text: 'column'
      },
      {
        type: 'field_input',
        name: 'VALUES',
        text: 'column'
      },
      {
        type: 'field_number',
        name: 'SIGNIFICANCE',
        value: 0.05
      }
    ],
    inputsInline: false,
    previousStatement: null,
    style: 'stats_blocks',
    tooltip: 'perform Kruskal-Wallis test',
    helpUrl: ''
  }
])

//
// Visuals for Kolmogorov-Smirnov test for normality.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'stats_kolmogorov_smirnov',
    message0: 'Kolmogorov-Smirnov test',
    args0: [],
    message1: 'column %1 mean μ %2 std dev σ %3 significance α %4',
    args1: [
      {
        type: 'field_input',
        name: 'COLUMN',
        text: 'column'
      },
      {
        type: 'field_number',
        name: 'MEAN',
        value: 0.0
      },
      {
        type: 'field_number',
        name: 'STD_DEV',
        value: 1.0
      },
      {
        type: 'field_number',
        name: 'SIGNIFICANCE',
        value: 0.05
      }
    ],
    inputsInline: false,
    previousStatement: null,
    style: 'stats_blocks',
    tooltip: 'perform Kolmogorov-Smirnov test',
    helpUrl: ''
  }
])