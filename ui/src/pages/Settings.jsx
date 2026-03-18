import UpdateSettingsForm from '../features/settings/UpdateSettingsForm';
import Heading from '../components/Heading';
import Row from '../components/Row';

const Settings = () => {
  return (
    <Row>
      <Heading as='h1'>Update hotel settings</Heading>
      <UpdateSettingsForm />
    </Row>
  );
};

export default Settings;
