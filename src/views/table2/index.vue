<template>
    <div>
    <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
        type="index"
        width="50">
        </el-table-column>
        <el-table-column
        prop="name"
        label="书名">
        </el-table-column>
        <el-table-column
        prop="auther"
        label="作者">
        </el-table-column>
        <el-table-column label="是否删除">
            <template slot-scope="scope">
            {{ scope.row.is_delete ? '是' : '否' }}
            <!-- {{ scope.row }} -->
            <!-- if (scope.row.is_delete) {
                return '是'
            } else {
                return '否'
            } -->
            </template>
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small" @click="visible = true;bookForm = scope.row">编辑</el-button>
            <!-- <el-button @click="deleteBook(scope.row)" type="text" style="color: red" size="small">删除</el-button> -->
            <el-popover
                placement="top"
                width="300"
                trigger="click">
                <p>确认要删除这条数据吗？</p>
                <div style="text-align: right; margin: 0">
                    <el-button type="primary" size="mini" @click="deleteBook(scope.row)">确定</el-button>
                </div>
                <el-button type="text" style="color: red" size="small" slot="reference">删除</el-button>
            </el-popover>
        </template>
        </el-table-column>
    </el-table>

    <el-dialog title="编辑图书" :visible.sync="visible">
        <el-form :model="bookForm" status-icon ref="bookForm" label-width="100px" class="demo-bookForm">
            <el-form-item label="id" prop="id">
                <el-input type="text" v-model="bookForm.id" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="书名" prop="name">
                <el-input type="text" v-model="bookForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="auther">
                <el-input type="text" v-model="bookForm.auther" autocomplete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="删除" prop="age">
                <el-input v-model.number="bookForm.is_delete"></el-input>
            </el-form-item> -->
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="updateBook();visible = false">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import { getBooksList, deleteBook, updateBook } from '@/api/user'

export default {

    data() {
        return {
            tableData: [],
            visible: false,
            bookForm: {
                id: '',
                name: '',
                auther: '',
                is_delete: false
            },
        }
    },


    beforeCreate() {
        // console.log('table2 beforeCreate')
    },

    mounted() {
        // console.log('table2 mounted')
        this.getBooksList()
    },

    created() {
        // console.log('table2 created')
    },

    methods: {
        handleClick(row) {
            console.log(row);
        },

        getBooksList() {
            getBooksList().then(response => {
                console.log('getBooksList ========> ', response)
                this.tableData = response.data.results
            })
        },

        deleteBook(row) {

            console.log('deleteBook ========> ', row)
            deleteBook(row.id).then(response => {
                console.log('deleteBook ========> ', response)
                this.getBooksList()
            })
        },
        updateBook() {
            console.log('updateBook ========> ', this.bookForm)
            var book_id = this.bookForm.id
            updateBook(book_id, this.bookForm).then(response => {
                console.log('updateBook ========> ', response)
                this.getBooksList()
            })
        },
    },
}
</script>