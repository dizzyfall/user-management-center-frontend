import {GithubOutlined} from '@ant-design/icons';
import {QqOutlined} from '@ant-design/icons';
import {DefaultFooter} from '@ant-design/pro-components';
import {useIntl} from 'umi';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'DZY出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'QQ',
          title: <><QqOutlined/>藍橋春雪</>,
          href: 'https://im.qq.com',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <><GithubOutlined/> dizzyfall </>,
          href: 'https://github.com/dizzyfall',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
