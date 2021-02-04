import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Link from '@material-ui/core/Link'
import Blockly from 'blockly/blockly_compressed'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import AdmZip from 'adm-zip'

function SaveDialog (props) {
  return (
    <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.contentText}
        </DialogContentText>
        <TextField
          autoFocus
          required id="standard-required"
          margin="dense"
          id="name"
          label="Data File Name"
          type="text"
          value={props.filename}
          fullWidth
          onChange={(evt) => props.handleFilenameChange(evt)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Cancel
        </Button>
        <Link id={props.linkId}>
          <Button onClick={() => props.handleDownload(props.data)} color="primary" >
            Download
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  )
}

export class SaveCsvFormDialog extends React.Component{
  constructor(props) {
    super(props)
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    const filename = 'data_' + year + '_' + month + '_' + day + '.csv'

    this.state = {
      open: false,
      filename: filename,
      linkId: 'downloadData',
      title: 'Save CSV Data',
      contentText: 'Enter the name for your data file.'
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.handleFilenameChange = this.handleFilenameChange.bind(this)
  }

  handleClickOpen () {
    this.setState({open: true})
  }

  handleClose () {
    this.setState({open: false})
  }

  handleFilenameChange (evt) {
    const value = evt.target.value
    this.setState({ filename: value })
  }

  handleDownload (data){
    const fields = Object.keys(data[0])
    const replacer = function(key, value) { return value === null ? '' : value }
    let csv = data.map(function(row){
      return fields.map(function(fieldName){
        return JSON.stringify(row[fieldName], replacer)
      }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n')
    const filename = this.state.filename
    let link = document.getElementById('downloadData')
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv))
    link.setAttribute('download', filename)
    this.handleClose()
  }

  render () {
    return (
      <div>
        <SaveDialog
          open={this.state.open}
          title={this.state.title}
          handleClose={this.handleClose}
          handleDownload={this.handleDownload}
          handleFilenameChange={this.handleFilenameChange}
          contentText={this.state.contentText}
          linkId={this.state.linkId}
          filename={this.state.filename}
          data={this.props.saveData}/>
      </div>
    )
  }
}

export class SaveWorkspaceFormDialog extends React.Component{
  constructor(props) {
    super(props)
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    const filename = 'workspace_' + year + '_' + month + '_' + day + '.jeff'

    this.state = {
      open: false,
      filename: filename,
      linkId: 'downloadWorkspace',
      title: 'Save Workspace',
      contentText: 'Enter the name for your workspace file.'
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.handleFilenameChange = this.handleFilenameChange.bind(this)
  }

  handleClickOpen () {
    this.setState({open: true})
  }

  handleClose () {
    this.setState({open: false})
  }

  handleFilenameChange (evt) {
    const value = evt.target.value
    this.setState({ filename: value })
  }

  handleDownload (data){
    const workspace = data
    const xml = Blockly.Xml.workspaceToDom(workspace)
    const text = Blockly.Xml.domToText(xml)
    const link = document.getElementById('downloadWorkspace')
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    link.setAttribute('download', this.state.filename)
    this.handleClose()
  }

  render () {
    return (
      <div>
        <SaveDialog
          open={this.state.open}
          title={this.state.title}
          handleClose={this.handleClose}
          handleDownload={this.handleDownload}
          handleFilenameChange={this.handleFilenameChange}
          contentText={this.state.contentText}
          linkId={this.state.linkId}
          filename={this.state.filename}
          data={this.props.data}/>
      </div>
    )
  }
}

// Helper function that returns the SVG of the provided workspace.
function getSvgXml(workspace){
  const canvas = workspace.svgBlockCanvas_.cloneNode(true)
  canvas.removeAttribute("transform");
  let themeCss = document.getElementById("blockly-renderer-style-thrasos-tidyblocks").innerHTML
  // Theme name isn't inserted on our pulled svg so we remove it.
  themeCss = themeCss.replace(/.thrasos-renderer.tidyblocks-theme/g, '')
  // Default blockly css.
  let blocklyCss = document.getElementById("blockly-common-style").innerHTML
  const css = `<defs><style type="text/css">` + themeCss + blocklyCss + `</style></defs>`
  const bboxElement = document.getElementsByClassName("blocklyBlockCanvas")[0];
  const bbox = bboxElement.getBBox();
  const content = new XMLSerializer().serializeToString(canvas);
  const xml = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${
    bbox.width}" height="${bbox.height}" viewBox=" ${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}">${
    css}">${content}</svg>`
  return xml
}

// Returns the number of bytes in a string, accounting for multi-byte characters.
// https://stackoverflow.com/a/12205668
function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1
}

export class SaveSvgFormDialog extends React.Component{
  constructor(props) {
    super(props)
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    const filename = 'svg_' + year + '_' + month + '_' + day + '.svg'

    this.state = {
      open: false,
      filename: filename,
      linkId: 'downloadSvg',
      title: 'Save SVG',
      contentText: 'Enter the name for your SVG file.'
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.handleFilenameChange = this.handleFilenameChange.bind(this)
  }

  handleClickOpen () {
    this.setState({open: true})
  }

  handleClose () {
    this.setState({open: false})
  }

  handleFilenameChange (evt) {
    const value = evt.target.value
    this.setState({ filename: value })
  }

  handleDownload (workspace){
    let xml = getSvgXml(workspace)
    const blob = new Blob([xml])
    const link = document.getElementById('downloadSvg')
    link.setAttribute('href', URL.createObjectURL(blob))
    link.setAttribute('download', this.state.filename)
    this.handleClose()
  }

  render () {
    return (
      <div>
        <SaveDialog
          open={this.state.open}
          title={this.state.title}
          handleClose={this.handleClose}
          handleDownload={this.handleDownload}
          handleFilenameChange={this.handleFilenameChange}
          contentText={this.state.contentText}
          linkId={this.state.linkId}
          filename={this.state.filename}
          data={this.props.data}/>
      </div>
    )
  }
}

export class SaveAllSvgFormDialog extends React.Component{
  constructor(props) {
    super(props)
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    const filename = year + '_' + month + '_' + day + '.zip'

    this.state = {
      open: false,
      filename: filename,
      linkId: 'downloadAllSvg',
      title: 'Save All SVGs',
      contentText: 'Enter the name for your zip file.',
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.handleFilenameChange = this.handleFilenameChange.bind(this)
  }

  handleClickOpen () {
    this.setState({open: true})
  }

  handleClose () {
    this.setState({open: false})
  }

  handleFilenameChange (evt) {
    const value = evt.target.value
    this.setState({ filename: value })
  }

  handleDownload (workspace){
    var regex = /type="(.*)"/g;
    const matchAll = this.props.toolbox.matchAll(regex);
    Blockly.mainWorkspace.clear()
    let svgZip = new AdmZip();

    // Iterate over all blocks we passed into our toolbox. Generate their svg,
    // and add the files to a list.
    for (const match of matchAll) {
      this.props.blocklyRef.current.workspace.importFromXml('<xml><block type="'
        + match[1] + '"></block></xml>')
      let xml = getSvgXml(workspace).toString('utf8')
      svgZip.addFile(match[1] + ".svg", Buffer.alloc(byteCount(xml), xml), match[1] + " svg file");
      Blockly.mainWorkspace.clear()
    }
    const zipBuffer = svgZip.toBuffer();
    const blob = new Blob([zipBuffer])
    const link = document.getElementById('downloadAllSvg')
    link.setAttribute('href', URL.createObjectURL(blob))
    link.setAttribute('download', this.state.filename)
    this.handleClose()
  }

  render () {
    return (
      <div>
        <SaveDialog
          open={this.state.open}
          title={this.state.title}
          handleClose={this.handleClose}
          handleDownload={this.handleDownload}
          handleFilenameChange={this.handleFilenameChange}
          contentText={this.state.contentText}
          linkId={this.state.linkId}
          filename={this.state.filename}
          data={this.props.data}/>
      </div>
    )
  }
}

export class LoadCsvDialog extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      url: '',
      pageName: 'default',
      csvName: '',
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.localFileUpload = this.localFileUpload.bind(this)
    this.urlLoad = this.urlLoad.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.loadCsv = this.loadCsv.bind(this)
    this.submit = this.submit.bind(this)
    this.submitLoadCsv = this.submitLoadCsv.bind(this)
    this.submitLoadUrlCsv = this.submitLoadUrlCsv.bind(this)

    this.csvFile = React.createRef()

  }

  handleClickOpen () {
    this.setState({pageName: 'default', csvName: '', url: '', open: true})
  }

  handleClose () {
    this.setState({open: false})
  }

  handleUrlChange (evt) {
    const value = evt.target.value
    this.setState({ url: value })
  }

  handleCsvNameChange (evt) {
    const value = evt.target.value
    this.setState({ csvName: value })
  }

  localFileUpload (fileUploadRef){
    this.refs.csvFile.click()
  }

  urlLoad(){
    // Get the end of the url, removing the extension (if it's there)
    const formattedUrl = this.state.url.replace(/#[^#]+$/, "").replace(/\?[^\?]+$/, "").replace(/\/$/, "");
    const label = formattedUrl.substr(formattedUrl.lastIndexOf("/") + 1).replace('.csv', '')
    this.setState({pageName: 'nameCsv', csvName: label, type: 'url'})
  }

  loadCsv(){
    const file = this.refs.csvFile.files[0]
    const name = file.name
    const label = name.replace('.csv', '')
    this.setState({pageName: 'nameCsv', csvName: label, type: 'localFile'})
  }

  submit(){
      if (this.state.type == 'localFile'){
        this.submitLoadCsv()
      } else if (this.state.type == 'url'){
        this.submitLoadUrlCsv()
      }
  }

  submitLoadCsv(){
    this.props.loadCsv(this.refs.csvFile.files[0], this.state.csvName)
    this.handleClose()
  }

  submitLoadUrlCsv(){
    this.props.loadCsvUrl(this.state.url, this.state.csvName)
    this.handleClose()
  }


  render () {
    const disabledBtnClass = "disabledBtn"
    let submitBtnClass = "uploadBtn"
    if (this.state.csvName.length == 0){
      submitBtnClass = disabledBtnClass
    }

    return (
      <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <input type="file" id="csvFile" ref="csvFile"
          onChange={this.loadCsv}
          style={{display: "none"}}/>

        <DialogTitle id="form-dialog-title">Load CSV</DialogTitle>
        { this.state.pageName == 'default' ?
          <>
            <DialogContent>
              <DialogContentText>
                Load a file from your local machine
              </DialogContentText>

                <a className={"uploadBtn"}
                  onClick={(e) => this.localFileUpload(this.csvFile)} >
                  <FontAwesomeIcon className="dialogBtnIcon"icon={faFileUpload} />
                  Select a File
                </a>

            </DialogContent>
            <DialogContent>
              <DialogContentText >
                or upload from a URL
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="url"
                placeholder="http://website.com/csvFile.csv"
                label="Url"
                type="text"
                value={this.state.url}
                onChange={(evt) => this.handleUrlChange(evt)}
                fullWidth
              />
              <a className={"uploadBtn"}
                onClick={this.urlLoad} >
                <FontAwesomeIcon className="dialogBtnIcon"icon={faCloudUploadAlt} />
                Load Url
              </a>
            </DialogContent>
          </>
      :
        <DialogContent>
          <DialogContentText>
            What name would you like to use for this CSV?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="url"
            placeholder="CSV File Name"
            label="CSV Name"
            type="text"
            value={this.state.csvName}
            onChange={(evt) => this.handleCsvNameChange(evt)}
            fullWidth
          />
          <a className={submitBtnClass}
            disabled
            onClick={submitBtnClass == disabledBtnClass ? undefined : this.submit} >
            Submit
          </a>
        </DialogContent>
      }
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
