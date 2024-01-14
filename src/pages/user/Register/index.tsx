import Footer from '@/components/Footer';
import {register} from '@/services/ant-design-pro/api';
import {
  AlipayCircleOutlined,
  LockOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import {Divider, message, Tabs} from 'antd';
import React, {useState} from 'react';
import {FormattedMessage, history, SelectLang, useIntl} from 'umi';
import styles from './index.less';
import {Link} from "@umijs/preset-dumi/lib/theme";

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const intl = useIntl();

  const handleSubmit = async (values: API.RegisterParams) => {
    // 简单前端校验
    const {userPassword, checkPassword} = values;
    if (userPassword !== checkPassword) {
      message.error('两次输入的密码不一致，请重新输入');
      return;
    }
    try {
      // 注册
      const id = await register(values);
      if (id === 1) {
        const defaultRegisterSuccessMessage = intl.formatMessage({
          id: 'pages.register.success',
          defaultMessage: '注册成功！',
        });
        message.success(defaultRegisterSuccessMessage);
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const {query} = history.location;
        history.push({
          pathname: '/user/login',
          query,
        });
        return;
      }
    } catch (error: any) {
      const defaultRegisterFailureMessage = intl.formatMessage({
        id: 'pages.register.failure',
        defaultMessage: '注册失败，请重试！',
      });
      message.error(defaultRegisterFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang/>}
      </div>
      <div className={styles.content}>
        <div>
          <LoginForm
            // 修改提交按钮的文字，由'登录'->'注册'
            submitter={
              {
                searchConfig: {
                  submitText: '注册',
                }
              }
            }
            title="注册用户管理中心账号"
            initialValues={{
              autoLogin: true,
            }}
            onFinish={async (values) => {
              await handleSubmit(values as API.RegisterParams);
            }}
          >
            <Tabs activeKey={type} onChange={setType}>

              <Tabs.TabPane
                key="account"
                tab={intl.formatMessage({
                  id: 'pages.register.accountLogin.tab',
                  defaultMessage: '账号注册',
                })}
              />
            </Tabs>
            {type === 'account' && (
              <>
                <ProFormText
                  name="userAccount"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon}/>,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.register.userAccount.placeholder',
                    defaultMessage: '账号',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.register.userAccount.required"
                          defaultMessage="请输入账号"
                        />
                      ),
                    },
                    {
                      min: 4,
                      type: "string",
                      message: "账号不小于4个字符",
                    },
                  ]}
                />
                <ProFormText.Password
                  name="userPassword"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon}/>,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.register.userPassword.placeholder',
                    defaultMessage: '密码',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.register.userPassword.required"
                          defaultMessage="请输入密码"
                        />
                      ),
                    },
                    {
                      min: 6,
                      type: "string",
                      message: "密码长度不小于6个字符",
                    },
                    {
                      max: 20,
                      type: "string",
                      message: "密码长度不超过20个字符",
                    },
                  ]}
                />
                <ProFormText.Password
                  name="checkPassword"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon}/>,
                  }}
                  placeholder={intl.formatMessage({ //表单提示语
                    id: 'pages.register.checkPassword.placeholder',
                    defaultMessage: '确认密码',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.register.checkPassword.required"
                          defaultMessage="两次输入的密码不一致，请重新输入"
                        />
                      ),
                    },
                  ]}
                />
              </>
            )}
          </LoginForm>
        </div>
        <div style={{
          marginTop: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
        >
          <Divider dashed={true} orientation={"center"} plain={true} style={{
            fontSize: 14,
            marginBottom: 20,
            marginTop: 20,
          }}
          >
            其他注册方式
          </Divider>
          <div>
            <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon}/>
            <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon}/>
            <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon}/>
          </div>
          <Divider dashed={true}
                   orientation={"center"}
                   plain={true}
                   style={{
                     marginBottom: 20,
                     marginTop: 20,
                   }}
          />
          <div>
            <Link to="/user/login">登录已有帐号&gt;</Link>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Register;
