import Footer from '@/components/Footer';
import {login} from '@/services/ant-design-pro/api';
import {getFakeCaptcha} from '@/services/ant-design-pro/login';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import {Alert, Divider, message, Space, Tabs} from 'antd';
import React, {useState} from 'react';
import {FormattedMessage, history, SelectLang, useIntl, useModel} from 'umi';
import styles from './index.less';
import {Link} from "@umijs/preset-dumi/lib/theme";


const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const {initialState, setInitialState} = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const user = await login({...values, type});
      if (user != null) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const {query} = history.location;
        const {redirect} = query as { redirect: string };
        history.push(redirect || '/');
        return;
      }
      // 如果失败去设置用户错误信息
      //setUserLoginState(user);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
    }
  };
  const {status, type: loginType} = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang/>}
      </div>
      <div className={styles.content}>
        <div style={{
          marginBottom: 0,
        }}
        >
          <LoginForm
            logo={<img alt="logo" src="/logo.svg"/>}
            title="用户管理中心"
            subTitle={'最好的管理'}
            initialValues={{
              autoLogin: true,
            }}
            onFinish={async (values) => {
              await handleSubmit(values as API.LoginParams);
            }}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane
                key="account"
                tab={intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账号密码登录',
                })}
              />
              <Tabs.TabPane
                key="mobile"
                tab={intl.formatMessage({
                  id: 'pages.login.phoneLogin.tab',
                  defaultMessage: '手机号登录',
                })}
              />
            </Tabs>
            {status === 'error' && loginType === 'account' && (
              <LoginMessage
                content={intl.formatMessage({
                  id: 'pages.login.accountLogin.errorMessage',
                  defaultMessage: '账号或密码错误',
                })}
              />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="userAccount"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon}/>,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.userAccount.placeholder',
                    defaultMessage: '账号',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.userAccount.required"
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
                    id: 'pages.login.userPassword.placeholder',
                    defaultMessage: '密码',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.userPassword.required"
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
              </>
            )}
            {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误"/>}
            {type === 'mobile' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined className={styles.prefixIcon}/>,
                  }}
                  name="mobile"
                  placeholder={intl.formatMessage({
                    id: 'pages.login.phoneNumber.placeholder',
                    defaultMessage: '手机号',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.phoneNumber.required"
                          defaultMessage="请输入手机号！"
                        />
                      ),
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: (
                        <FormattedMessage
                          id="pages.login.phoneNumber.invalid"
                          defaultMessage="手机号格式错误！"
                        />
                      ),
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon}/>,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.captcha.placeholder',
                    defaultMessage: '请输入验证码',
                  })}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} ${intl.formatMessage({
                        id: 'pages.getCaptchaSecondText',
                        defaultMessage: '获取验证码',
                      })}`;
                    }
                    return intl.formatMessage({
                      id: 'pages.login.phoneLogin.getVerificationCode',
                      defaultMessage: '获取验证码',
                    });
                  }}
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.captcha.required"
                          defaultMessage="请输入验证码！"
                        />
                      ),
                    },
                  ]}
                  onGetCaptcha={async (phone) => {
                    const result = await getFakeCaptcha({
                      phone,
                    });
                    // @ts-ignore
                    if (result === false) {
                      return;
                    }
                    message.success('获取验证码成功！');
                  }}
                />
              </>
            )}
            <div
              style={{
                marginBottom: 10,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录"/>
              </ProFormCheckbox>
            </div>
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
            其他登录方式
          </Divider>
          <div>
            <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon}/>
            <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon}/>
            <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon}/>
          </div>
          <div>
            <Divider dashed={true}
                     orientation={"center"}
                     plain={true}
                     style={{
                       marginBottom: 20,
                       marginTop: 20,
                     }}
            />
            <Space size={56}>
              <div>
                <Link to="/user/register">立即注册</Link>
                <Divider type={"vertical"}/>
              </div>
              <div>
                <a>
                  <FormattedMessage id="pages.login.forgotAccount" defaultMessage="忘记账号"/>
                </a>
                <Divider type={"vertical"}/>
              </div>
              <div>
                <a>
                  <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码"/>
                </a>
              </div>
            </Space>
          </div>
          <div>
            <Divider dashed={true}
                     orientation={"center"}
                     plain={true}
                     style={{
                       marginBottom: 20,
                       marginTop: 20,
                     }}
            />
            <div>
              <p style={
                {
                  fontSize: 14,
                  fontWeight: 'normal',
                }}
              >
                登录遇到问题?
              </p>
            </div>
            <div>
              <p style={
                {
                  fontSize: 12,
                  fontWeight: 'normal',
                }}
              >
                原登录方式不可用、密码无法找回、账号管理员变动，<a href={"/"}>请向我们联系</a>
              </p>
            </div>
          </div>
        </div>

      </div>
      <Footer/>
    </div>
  );
};

export default Login;
