<!-- <template>
<div>
    <div>
        <bar-chart class="chart-container" :chart-data="chartData" :options="chartOptions" ref="barChart"></bar-chart>
    </div>
</div>
</template>

<script>
import {
    Bar
} from "vue-chartjs";
import {
    Line
} from "vue-chartjs";
import axios from "axios";

export default {
    name: "UserInteractionsChart",
    props: {
        estateId: {
            type: Number,
            required: true,
        },
    },
    components: {
        BarChart: {
            extends: Bar,
            props: ["chartData", "options"],
            mounted() {
                this.renderChart(this.chartData, this.options);
            },
        },
    },
    data() {
        return {
            user_total: 10000,
            ex3: {
                label: "Users prediction",
                val: 10000 + "views",
                color: "green"
            },
            totalViews: 0,
            plays: 864,
            user: 10000,
            selectedDayType: "good",
            selectedDate: "2023-08-01", 
            goodDayInteractions: 18000,
            badDayInteractions: 10000,
            userInteractions: [{
                    date: "Jan",
                    interactions: 180
                },
                {
                    date: "Feb",
                    interactions: 390
                },
                {
                    date: "Mar",
                    interactions: 200
                },
                {
                    date: "Apr",
                    interactions: 800
                },
                {
                    date: "May",
                    interactions: 650
                },
                {
                    date: "Jun",
                    interactions: 1450
                },
               
                {
                    date: "Jul",
                    interactions: 950
                },
                {
                    date: "Aug",
                    interactions: 200
                },
                {
                    date: "Sep",
                    interactions: 800
                },
                {
                    date: "Oct",
                    interactions: 650
                },
                {
                    date: "Nov",
                    interactions: 1450
                },
                
                {
                    date: "Dec",
                    interactions: 950
                },
            ],
            chartData: {
                labels: [],
                datasets: [{
                    label: 'Category tracking',
                    backgroundColor: '#f0ee7377',
                    data: []
                }]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            },
            messageBad: "",
            messageGood: "",
            messageState: false,
            data: null,
        };
    },
    mounted() {
        this.calculateTotalViews2();
    },
    created() {
        this.prepareChartData();
    },
    methods: {
        shortWord(label) {
            if (!label) return ''

            const words = label.split(' ')
            if (words.length === 1) return words[0]

            const first = words[0].slice(0, 3)
            const rest = words
                .slice(1)
                .map(w => w[0])
                .join('')

            return `${first} ${rest}`
        },
        async prepareChartData() {
            let that = this;
            await axios.get('https://amacserver-production-ebd5.up.railway.app/api/votes/categoty-activity', {})
                .then(function (response) {
                    if (response.status == 200) {
                       
                        that.data = response.data;
                        console.log(that.data)
                        that.chartData.labels = that.data.map((data) => that.shortWord(data.category_name));
                        that.chartData.datasets[0].data = that.data.map(
                            (data) => data.nominee_count
                        );
                        that.$refs.barChart.renderChart(that.chartData, that.chartOptions);
                    } else if (response.status == 400) {
                        that.snackbar2 = true;
                        that.snackbarText2 = response.data;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    that.snackbarText2 = error;
                    that.snackbar2 = true;
                });

            

        },
        changeTotal(val) {
            this.user_total = Intl.NumberFormat().format(val);
            return;
        },
        calculateAverageViews() {
            return this.totalViews / this.users;
        },
        calculateTotalViews(val) {
            if (val < 7000) {
                this.messageBad = "Bad days";
                this.messageState = false;
            } else if (val > 7000) {
                this.messageGood = "Good days";
                this.messageState = true;
            }
            this.totalViews = this.plays * val;
            return this.totalViews;
        },
        calculateTotalViews2() {
            this.totalViews = this.plays * 10000;
            return this.totalViews;
        },
        selectDayType(dayType) {
            this.selectedDayType = dayType;
            this.updateChartData();
        },
        selectDate(date) {
            this.selectedDate = date;
            this.updateChartData();
        },
        updateChartData() {
            const interactions =
                this.selectedDayType === "good" ?
                this.goodDayInteractions :
                this.badDayInteractions;
            this.chartData.datasets[0].data = [interactions];
            this.$refs.barChart.renderChart(this.chartData, this.chartOptions);
        },
    },
};
</script>

<style scoped>
.chart-container {
    position: relative;
    height: 300px;
    color: #f0ee7377;
}
</style> -->
