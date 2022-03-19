<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="Record ID" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lendingRecordId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Crew Name" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.crewName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Prop Name" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.propName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Depot Name" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.depotName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出借数量" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.borrowNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日租金" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.dailyRent }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租期(天)" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rentalDays }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归还数量" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.return_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Remark" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.operator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出借时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归还时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.returnTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Record ID" prop="lendingRecordId">
          <el-input v-model="temp.lendingRecordId" :disabled="true" />
        </el-form-item>
        <el-form-item label="Crew Name" prop="crewName">
          <el-select v-model="temp.crewId" filterable remote placeholder="请输入关键词" :remote-method="remoteCrewSearch" :loading="searchLoading">
            <el-option v-for="item in tempCrewList" :key="item.crewId" :label="item.crewName" :value="item.crewId" />
          </el-select>
        </el-form-item>
        <el-form-item label="Prop Name" prop="propName">
          <el-select v-model="temp.propId" filterable remote placeholder="请输入关键词" :remote-method="remotePropSearch" :loading="searchLoading">
            <el-option v-for="item in tempPropList" :key="item.propId" :label="item.propName" :value="item.propId" />
          </el-select>
        </el-form-item>
        <el-form-item label="Depot Name" prop="depotName">
          <el-select v-model="temp.depotId" filterable remote placeholder="请输入关键词" :remote-method="remoteDepotSearch" :loading="searchLoading">
            <el-option v-for="item in tempDepotList" :key="item.depotId" :label="item.depotName" :value="item.depotId" />
          </el-select>
        </el-form-item>
        <el-form-item label="出借数量" prop="borrowNum">
          <el-input-number v-model="temp.borrowNum" size="mini" controls-position="right" :min="0" :max="9999" label="出借数量" />
        </el-form-item>
        <el-form-item label="日租金" prop="dailyRent">
          <el-input-number v-model="temp.dailyRent" :precision="2" size="mini" controls-position="right" :min="0" :max="9999" label="日租金" />
        </el-form-item>
        <el-form-item label="租期" prop="rentalDays">
          <el-input-number v-model="temp.rentalDays" size="mini" controls-position="right" :min="0" :max="9999" label="租期" />
        </el-form-item>
        <el-form-item label="归还数量" prop="returnNum">
          <el-input-number v-model="temp.returnNum" size="mini" controls-position="right" :min="0" :max="9999" label="归还数量" />
        </el-form-item>
        <el-form-item label="归还时间" prop="returnTime">
          <el-date-picker v-model="temp.returnTime" type="datetime" placeholder="选择归还时间" />
        </el-form-item>
        <el-form-item label="Remark" prop="remark">
          <el-input v-model="temp.remark" type="textarea" :rows="2" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createRecord, updateRecord, deleteRecord } from '@/api/record'
import { searchCrew } from '@/api/crew'
import { searchProp } from '@/api/prop'
import { searchDepot } from '@/api/depot'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'RecordComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      tempCrewList: null,
      tempPropList: null,
      tempDepotList: null,
      search: {
        keyword: undefined
      },
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        depotId: undefined,
        depotName: '',
        description: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      searchLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        depotId: undefined,
        depotName: '',
        description: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRecord(this.temp).then(response => {
            this.list.unshift(response.data.item)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.tempCrewList = [
        { 'crewId': this.temp['crewId'], 'crewName': this.temp['crewName'] }
      ]
      this.tempPropList = [
        { 'propId': this.temp['propId'], 'propName': this.temp['propName'] }
      ]
      this.tempDepotList = [
        { 'depotId': this.temp['depotId'], 'depotName': this.temp['depotName'] }
      ]
      delete (this.temp.createTime)
      delete (this.temp.updateTime)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateRecord(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.temp.updateTime = new Date()
            this.temp.createTime = this.list[index].createTime
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    remoteCrewSearch(query) {
      this.searchLoading = false
      if (query !== '') {
        this.searchLoading = true
        this.search.keyword = query
        searchCrew(this.search).then(response => {
          this.searchLoading = false
          this.tempCrewList = response.data.items
        })
      }
    },
    remotePropSearch(query) {
      this.searchLoading = false
      if (query !== '') {
        this.searchLoading = true
        this.search.keyword = query
        searchProp(this.search).then(response => {
          this.searchLoading = false
          this.tempPropList = response.data.items
        })
      }
    },
    remoteDepotSearch(query) {
      this.searchLoading = false
      if (query !== '') {
        this.searchLoading = true
        this.search.keyword = query
        searchDepot(this.search).then(response => {
          this.searchLoading = false
          this.tempDepotList = response.data.items
        })
      }
    },
    handleDelete(row, index) {
      this.listLoading = true
      deleteRecord(this.list[index]).then(response => {
        this.listLoading = false
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
