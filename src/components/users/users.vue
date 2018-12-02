<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col>
        <el-input clearable placeholder="请输入内容" class="input-with-select users-search" v-model="query" @clear="clearEvent()">
          <el-button slot="append" icon="el-icon-search" @click="userSearch()"></el-button>
        </el-input>
        <el-button type="success" plain @click="showForm()">添加按钮</el-button>
      </el-col>
    </el-row>
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEvent()">取 消</el-button>
        <el-button type="primary" @click="sureEvent()">确 定</el-button>
      </div>
    </el-dialog>
    <el-table :data="userList" style="width: 100%" height="250px">
      <el-table-column type="index" label="#" width="180">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
      <el-table-column prop="mobile" label="电话">
      </el-table-column>
      <el-table-column label="创建日期">
        <template slot-scope="scope">
          {{scope.row.create_time | fmtdate}}
        </template>
      </el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <el-switch @change="modifyUserState(scope.row.id, scope.row.mg_state)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="userEditEvent(scope.row.id)"></el-button>
            <el-button size="mini" plain type="success" icon="el-icon-check" circle @click="giveRowForm(scope.row.id)"></el-button>
            <el-button size="mini" plain type="danger" icon="el-icon-delete" circle @click="deleteEvent(scope.row.id)"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>
    <el-dialog title="编辑用户" :visible.sync="dialogEditFormVisible">
      <el-form :model="editData">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="editData.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="editData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="editData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEditEvent()">取 消</el-button>
        <el-button type="primary" @click="sureEditEvent()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="dialogRoleFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          {{roleCurrentName}}
        </el-form-item>
        <el-form-item label="角色" label-width="100px">
          <el-select v-model="roleId" placeholder="请选择活动区域">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="(item, index) in getRoles" :label="item.roleName" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelgiveRoles()">取 消</el-button>
        <el-button type="primary" @click="suregiveRoles()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      getRoles: [],
      roleId : -1,
      currentId: -1,
      roleCurrentName: '',
      editData: {},
      userList: [],
      pagenum: 2,
      pagesize: 2,
      query: '',
      total: 0,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      dialogRoleFormVisible: false,
      selectValue: "shanghai",
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [{ required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    async getUserList() {
      const AUTH_TOKEN = localStorage.getItem('token');
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN;
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      const { meta: { msg, status }, data: { total, users, pagenum } } = res.data;
      console.log(users);
      if (status === 200) {
        this.userList = users;
        this.total = total;
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      console.log(val);
      this.getUserList();
    },
    userSearch() {
      this.getUserList();
    },
    clearEvent() {
      this.getUserList();
    },
    showForm() {
      this.dialogFormVisible = true
    },
    cancelEvent() {
      this.form = {};
      this.dialogFormVisible = false;
    },
    async sureEvent() {
      const res = await this.$http.post('users', this.form);
      const { data, meta: { status, msg } } = res.data;
      if (status === 201) {
        this.$message.success(msg);
        this.form = {};
        this.dialogFormVisible = false;
        this.getUserList()
      } else {
        this.$message.warning(msg);
      }
    },
    deleteEvent(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete('users/' + id);
        this.pagenum = 1;
        this.getUserList();
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async userEditEvent(id) {
      this.dialogEditFormVisible = true;
      const res = await this.$http.get(`users/${id}`);
      const { data, meta: { status, msg } } = res.data;
      if (status === 200) {
        this.editData = data;
      }
    },
    cancelEditEvent() {
      this.editData = {};
      this.dialogEditFormVisible = false;
    },
    async sureEditEvent() {
      this.dialogEditFormVisible = false;
      const res = await this.$http.put(`users/${this.editData.id}`, { email: this.editData.email, mobile: this.editData.mobile });
      this.editData = {};
      this.getUserList();
    },
    async modifyUserState(id, type) {
      const res = await this.$http.put(`users/${id}/state/${type}`);
      const { data, meta: { msg, status } } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async giveRowForm(id) {
      this.currentId = id;
      this.dialogRoleFormVisible = true;
      const res1 = await this.$http.get('users/'+id);
      const {data:{username, rid}, meta:{status, msg}} = res1.data;
      if(status === 200) {
        this.roleCurrentName = username;
        this.roleId = rid;
        const res2 = await this.$http.get(`roles`);
        const {data,meta:{msg, status}} = res2.data;
        if(status ===200) {
          this.getRoles = data;
        }
      }

    },
    cancelgiveRoles() {
      this.dialogRoleFormVisible = false;
    },
    async suregiveRoles() {
  
      const res = await this.$http.put(`users/${this.currentId}/role`, {rid: this.roleId});
        console.log(res);
        const {data, meta: {status, msg}} = res.data;
        if(status ===200) {
          this.$message.success(msg);
          this.dialogRoleFormVisible = false;
        }
    }
  },
  created() {
    this.getUserList()
  },
}

</script>
<style>
.users-search {
  margin-top: 20px;
  width: 400px;
}

.box-card {
  height: 100%;
}

</style>
