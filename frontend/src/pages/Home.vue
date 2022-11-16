<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import type { Ref, UnwrapRef } from 'vue'
import {
  PlusCircleOutlined,
  EditOutlined,
  CheckOutlined,
} from '@ant-design/icons-vue'
import { message, notification } from 'ant-design-vue'
import type { TableColumnType, TableProps } from 'ant-design-vue'
import cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { logEvent } from 'firebase/analytics'
import { ANALYTICS } from 'src/configs/firebase'
import {
  IExpense,
  ICreateExpense,
  ExpenseTypes,
  TExpenseType,
} from 'src/models'
import {
  CreateExpense,
  DeleteExpense,
  GetExpenses,
  UpdateExpense,
} from 'src/services'

type TCustomExpense = {
  description: string
  type: TExpenseType
  amount: number
  date: Dayjs
}
const DATE_FORMAT = 'YYYY-MM-DD'

const expensesTableRef = ref(null)
const loading = ref(false)
const dialogState = ref(false)
const expenseDate = ref<Dayjs>()
const expense = ref<ICreateExpense>({
  description: '',
  amount: 0.0,
  type: 'Bills',
})
const tableSort = ref<any>({})
const tableFilter = ref<any>({})
const expenses = ref<IExpense[]>([])
const editableData: UnwrapRef<Record<string, TCustomExpense>> = reactive({})

const uniqueTypeList = ExpenseTypes.map(e => ({ text: e, value: e }))
const uniqueDateList = computed(() => [...new Set(expenses.value.map((ex) => ex.date))].map((ex) => ({
  text: ex,
  value: ex,
})))

const expensesHeader = computed(() => [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    filters: uniqueDateList.value,
    filterMultiple: true,
    filteredValue: tableFilter.value?.date || null,
    onFilter: (value: string, ex: IExpense) => value === ex.date.toString(),
    sorter: {
      compare: (a: IExpense, b: IExpense) =>
        Number(dayjs(a.date).format('x')) - Number(dayjs(b.date).format('x')),
      multiple: 1,
    },
    sortOrder: tableSort.value?.columnKey === 'date' && tableSort.value?.order,
    fixed: 'left',
    ellipsis: true,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    filters: uniqueTypeList,
    filteredValue: tableFilter.value?.type || null,
    filterMultiple: true,
    onFilter: (value: string, ex: IExpense) => value === ex.type,
    sorter: {
      compare: (a: IExpense, b: IExpense) => a.type > b.type,
      multiple: 2
    },
    sortOrder: tableSort.value?.columnKey === 'type' && tableSort.value?.order,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    sorter: {
      compare: (a: IExpense, b: IExpense) => Number(a.amount) - Number(b.amount),
      multiple: 3
    },
    sortOrder: tableSort.value?.columnKey === 'amount' && tableSort.value?.order,
  },
  {
    title: '',
    dataIndex: 'operations',
    fixed: 'right'
  },
])
const validForm = computed(
  () =>
    !expense.value.amount && !expense.value.description && !expense.value.type
)
const totalExpenses = computed(() =>
  expenses.value.reduce((sum, ex) => (sum += ex.amount), 0)
)

// Get all User's Expenses on page mount
onMounted(async () => {
  loading.value = true
  const externalExpenses = await GetExpenses()
  if (externalExpenses && externalExpenses.length) {
    expenses.value = externalExpenses.map((ex) => {
      const formattedDate = dayjs(ex.date).format(DATE_FORMAT)
      return {
        ...ex,
        date: formattedDate,
      }
    })
  }
  loading.value = false
})

const handleTableChange: TableProps['onChange'] = (
  pagination,
  filters,
  sorter
) => {
  tableSort.value = sorter
  tableFilter.value = filters
}

const addExpense = async () => {
  loading.value = true
  expense.value.amount = Number(expense.value.amount)

  if (expenseDate.value) {
    expense.value.date = expenseDate.value.toISOString()
  }

  const newExpense = await CreateExpense(expense.value)

  if (!newExpense) {
    notification['error']({
      message: 'Error!',
      description: 'Something went wrong while adding expense',
    })
    loading.value = false
    return
  }

  expenses.value.push({
    ...newExpense,
    date: dayjs(newExpense.date as string).format(DATE_FORMAT),
  } as IExpense)

  dialogState.value = false
  loading.value = false
  expense.value = { description: '', amount: 0, type: 'Bills' }
  message['success']({ content: 'Expense added!' })
  logEvent(ANALYTICS, 'add_expense')
}

const edit = (id: number) => {
  const row = cloneDeep(expenses.value.filter((item) => id === item.id)[0])
  editableData[id] = cloneDeep({ ...row, date: dayjs(row.date) })
}

const save = async (id: number) => {
  const updatedRow = Object.assign(
    expenses.value.filter((item) => id === item.id)[0],
    editableData[id],
    { date: editableData[id].date.toISOString() }
  )

  const updatedExpense = await UpdateExpense({
    id: updatedRow.id,
    description: updatedRow.description,
    type: updatedRow.type,
    date: updatedRow.date,
    amount: updatedRow.amount,
  })

  if (!updatedExpense) {
    message['error']({ content: 'Expense not updated!' })
    delete editableData[id]
  }

  const index = expenses.value.findIndex((e) => e.id === updatedExpense?.id)
  if (index >= 0) {
    expenses.value.splice(index, 1, {
      ...updatedExpense,
      date: dayjs(updatedExpense?.date as string).format(DATE_FORMAT),
    } as IExpense)
  }

  message['success']({ content: 'Expense updated!' })
  delete editableData[id]
  logEvent(ANALYTICS, 'update_expense')
}

const onDelete = async (id: number) => {
  loading.value = true

  const isDeleted = await DeleteExpense(id)
  if (!isDeleted) {
    message['error']({ content: 'Expense not deleted!' })
    return
  }

  message['success']({ content: 'Expenses deleted!' })
  loading.value = false
  expenses.value = expenses.value.filter((item) => item.id !== id)
  logEvent(ANALYTICS, 'delete_expense')
}
</script>

<template>
  <div>
    <!-- Expense Table -->
    <a-row
      type="flex"
      align="middle"
      justify="center"
      :style="{ height: '100%' }"
    >
      <a-col :xs="23" :sm="22" :md="5" :style="{ margin: '20px' }">
        <a-card>
          <a-statistic
            :title="`Total Expenses as of ${dayjs().format('MMM DD, YYYY')}`"
            :value="totalExpenses"
            prefix="₱"
          />
        </a-card>
      </a-col>
      <a-col :span="24" :style="{ margin: '20px', width: '100%' }">
        <a-table
          :dataSource="expenses"
          :columns="expensesHeader"
          :loading="loading"
          :style="{ width: '100%' }"
          resizeable
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'date'">
              <div class="editable-cell">
                <div v-if="editableData[record.id]">
                  <a-date-picker
                    v-model:value="editableData[record.id].date"
                    @keypress.enter="save(record.id)"
                    :style="{ width: '100%' }"
                  >
                    <template #addonAfter>
                      <CheckOutlined
                        class="editable-cell-icon-check"
                        @click="save(record.id)"
                      />
                    </template>
                  </a-date-picker>
                </div>
                <div v-else class="editable-cell-text-wrapper">
                  {{ text || ' ' }}
                </div>
              </div>
            </template>

            <template v-else-if="column.dataIndex === 'description'">
              <div class="editable-cell">
                <div v-if="editableData[record.id]">
                  <a-input
                    v-model:value="editableData[record.id].description"
                    @keypress.enter="save(record.id)"
                    @blur="save(record.id)"
                  >
                    <template #addonAfter>
                      <CheckOutlined
                        class="editable-cell-icon-check"
                        @click="save(record.id)"
                      />
                    </template>
                  </a-input>
                </div>
                <div v-else class="editable-cell-text-wrapper">
                  {{ text || ' ' }}
                </div>
              </div>
            </template>

            <template v-else-if="column.dataIndex === 'type'">
              <div class="editable-cell">
                <div v-if="editableData[record.id]">
                  <a-select
                    v-model:value="editableData[record.id].type"
                    :options="ExpenseTypes.map((e) => ({ label: e, value: e }))"
                    @keypress.enter="save(record.id)"
                    @select="save(record.id)"
                    :style="{ width: '100%' }"
                  >
                    <template #addonAdter>
                      <CheckOutlined
                        class="editable-cell-icon-check"
                        @click="save(record.id)"
                      />
                    </template>
                  </a-select>
                </div>
                <div v-else class="editable-cell-text-wrapper">
                  {{ text || ' ' }}
                </div>
              </div>
            </template>

            <template v-else-if="column.dataIndex === 'amount'">
              <div class="editable-cell">
                <div v-if="editableData[record.id]">
                  <a-input-number
                    v-model:value="editableData[record.id].amount"
                    :min="0"
                    @keypress.enter="save(record.id)"
                  >
                    <template #addonAfter>
                      <CheckOutlined
                        class="editable-cell-icon-check"
                        @click="save(record.id)"
                      />
                    </template>
                  </a-input-number>
                </div>
                <div v-else class="editable-cell-text-wrapper">
                  {{ text || ' ' }}
                </div>
              </div>
            </template>

            <template v-else-if="column.dataIndex === 'operations'">
              <a-popconfirm
                v-if="expenses.length"
                title="Are you sure to delete?"
                @confirm="onDelete(record.id)"
              >
                <a-button size="small" type="text" danger>Delete</a-button>
              </a-popconfirm>

              <a-button
                size="small"
                @click="edit(record.id)"
                :style="{ marginLeft: '10px' }"
                v-if="
                  !editableData[record.id] ||
                  !Object.keys(editableData[record.id]).length
                "
              >
                Edit
              </a-button>

              <a-button
                size="small"
                @click="delete editableData[record.id]"
                :style="{ marginLeft: '10px' }"
                v-else
              >
                Cancel
              </a-button>

              <a-button
                size="small"
                type="primary"
                @click="save(record.id)"
                :style="{ marginLeft: '10px' }"
                v-show="
                  editableData &&
                  editableData[record.id] &&
                  Object.keys(editableData[record.id]).length
                "
              >
                Save
              </a-button>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>

    <!-- Add Expense Dialog -->
    <a-modal
      v-model:visible="dialogState"
      title="Add Expense"
      :ok-button-props="{
        disabled: validForm,
        loading,
      }"
      :cancel-button-props="{
        disabled: loading,
      }"
      @ok="addExpense"
    >
      <a-form layout="vertical">
        <a-form-item label="Description" name="description">
          <a-textarea
            v-model:value="expense.description"
            placeholder="describe your expense..."
            auto-size
          />
        </a-form-item>

        <a-form-item label="Date" name="date">
          <a-date-picker
            v-model:value="expenseDate"
            allowClear
            :style="{ width: '100%' }"
          />
        </a-form-item>

        <a-form-item label="Expense Type" name="expenseType">
          <a-select
            v-model:value="expense.type"
            :options="ExpenseTypes.map((e) => ({ label: e, value: e }))"
            placeholder=""
          />
        </a-form-item>

        <a-form-item label="Amount" name="expenseAmount">
          <a-input-number
            v-model:value="expense.amount"
            :min="0"
            :style="{ width: '100%' }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-button
      type="primary"
      size="large"
      shape="circle"
      :style="{ position: 'fixed', top: '92%', right: '2%' }"
      @click="dialogState = true"
    >
      <template #icon>
        <PlusCircleOutlined />
      </template>
    </a-button>
  </div>
</template>
